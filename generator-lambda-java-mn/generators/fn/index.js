"use strict";
const FnGenerator = require("../commons/FnGenerator");
/**
 * Generador de funciones. Las funciones se pueden agregar a un proyecto base previamente creado
 * se supone son autocontenidas, por lo que no deberían tener dependencias entre ellas, solamente a modulos
 * comunes.
 * Las funciones solo pueden tener
 */
module.exports = class extends FnGenerator {
  /**
   * Cola para consultar al usuario
   * @return {Promise} promesa de los valores ingresados por el usuario
   */
  prompting() {
    const prompts = [
      {
        type: "input",
        name: "functionName",
        message: "¿Cuál es el nombre de la función?",
        default: "my-function", // nombre por defecto
      },
      {
        type: "list",
        name: "trigger",
        message: "¿Cuál es el tipo de evento que disparará la función?",
        // Importante, si va a agregar mas eventos debe agregar:
        // - el respectivo json en 'templates/events/{trigger}.json'
        // - el respectivo Request en 'src/main/pkgBase/model/Request-{trigger}.java
        choices: ["generic", "s3"], // triggers: generico, s3, sqs
        default: 0,
      },
    ];

    return this.prompt(prompts).then((props) => {
      // To access props later use this.props.someAnswer;
      this.props = props;

      this.props.pkgBase = this.config.get("pkgBase");
      this.props.projectName = this.config.get("projectName");
      this.props.appVersion = this.config.get("appVersion");

      this.props.functionNameCamelCase = this._toCamelCase(
        this.props.functionName
      );

      // actualizamos el paquete base PELIGROSA MUTACIÓN mucho cuidado
      this.props.pkgBase = `${this.props.pkgBase}.${this._toPkg(
        this.props.functionName
      )}`;

      this.log("usamos temporalmente pkgBase como: " + this.props.pkgBase);

      const functionsList = this.config.get("functionsList") || [];
      functionsList.push(this.props.functionName);

      this.config.set("functionName", this.props.functionName);
      this.config.set("functionsList", functionsList);

      this.config.save();
    });
  }

  /**
   * Cola de inicialización
   */
  initializing() {
    // Todos ellos requieren que el paquete base sea: pkgBase.functionNameCamelCase
    // Indicamos al generador raíz de los generadores especificos
    // Enviamos el parametro indi
    this.composeWith(require.resolve("../config-manager-ssm"), {
      invokedFromFnController: true,
    });
    // permite gestionar los diferentes servicios de backend disponibles para la función
    this.composeWith(require.resolve("../backend"), {
      invokedFromFnController: true,
    });
    this.composeWith(require.resolve("../svc"), {
      invokedFromFnController: true,
    });
  }

  /**
   * Cola de escritura
   */
  writing() {
    // se copia el archivo fuente de la función con un controlador
    this._copySrc(this.props);

    // se copia un script build gradle por cada función, dentro de la carpeta de la función
    this.fs.copyTpl(
      this.templatePath("build.gradle"),
      this.destinationPath(`${this.props.functionName}/build.gradle`),
      this.props
    );

    // se copian los eventos para pruebas, depende del controlador y el tipo de evento que lo dispara
    // agregamos el nombre archivo del evento para la función, este se copiará en el README.md
    this.props.eventFile = `events/${this.props.functionName}-${this.props.trigger}.json`;
    this.fs.copyTpl(
      this.templatePath(`events/${this.props.trigger}.json`),
      this.destinationPath(this.props.eventFile),
      this.props
    );

    // se agregan modificaciones a los archivos base
    this._appendHelper(this.props, "README-snippet.md", "README.md");
    this._appendHelper(
      this.props,
      "settings-snippet.gradle",
      "settings.gradle"
    );
    this._appendHelper(this.props, "template-snippet.yml", "template.yml");

    // agregamos las dependencias
    this._appendLocalDependency(this.props, "fn-controller-dependencies");
  }

  /**
   * Método privado que sirve para agrupar las tareas de generación de código fuente
   * @param {Map} props retorna un Mapa con valores útiles para reemplazar en las plantillas
   */
  _copySrc(props) {
    this.log(
      `Copiando archivos fuente para la función, con el paquete base: ${props.pkgBase}`
    );
    // se copian los archivos principales
    const otherfilesMain = [
      // controller
      "model/response/Response.java",
      "controller/LambdaController.java",
    ];

    // copiar todos los objetos asociados al request, dejando el objeto raíz
    // este método incluye los objetos hijos del request, los cuales tienen
    // por convención un sufijo con el tipo de 'trigger'
    const allRequestObjPaths = this._getAllRequestObj(
      "src/main/java/pkgBase",
      this.props.trigger
    );

    const filesMain = otherfilesMain.concat(allRequestObjPaths);

    // copiamos los archivos y usamos '_removeNameSuffix' para quitar los sufijos de los objetos en 'allRequestObjPaths'
    this._copySrcWithOtherNameHelper(
      props,
      "src/main/java/pkgBase",
      filesMain,
      this._removeNameSuffix
    );

    // se copian los recursos principales
    const resourcesMain = ["application.yml", "logback.xml"];
    this._copyRscHelper(props, "src/main/resources", resourcesMain);

    // se copian las archivos de pruebas
    // TODO hacer los test generales
    const filesTest = [
      "architecture/LayeredArchitectureTest.java",
      "controller/LambdaControllerTest.java",
    ];
    this._copySrcHelper(props, "src/test/java/pkgBase", filesTest);
    // se copian los recursos de pruebas
    const resourcesTest = [];
    this._copyRscHelper(props, "src/test/resources", resourcesTest);
  }

  /**
   * Método privado que retorna un arreglo con las rutas de todos los objetos hijos de un Request.
   * @param {String} prefixPath ruta donde deberían estar los objetos.
   * @param {String} trigger Tipo de evento disparador del que se deben recoger todos los objetos hijos.
   * @return {Array} Arreglo con las rutas de los objetos hijos.
   */
  _getAllRequestObj(prefixPath, trigger) {
    // TODO: agregar mecanismo para recoger todos los hijos que cumplan con:
    // '{prefixPath}/*-${trigger}.java
    return [`model/request/Request-${trigger}.java`];
  }

  /**
   * Quita el sufijo en el nombre de un archivo
   * Esperamos una entrada tipo: Nombre-sufijo.ext <- caso base
   * @param {String} strInput Nombre del archivo
   * @return {String} Nombre del archivo sin sufijo
   */
  _removeNameSuffix(strInput) {
    const dotSplit = strInput.split(".");
    if (dotSplit.length != 2) {
      return strInput;
    }

    // separamos el nombre y la extensión
    const ext = dotSplit[1]; // .ext
    const nameWithSuffix = dotSplit[0]; // Nombre-sufijo

    const nameWithoutSuffix = nameWithSuffix.replace(/-[a-z0-9]+/g, ""); // Nombre
    return `${nameWithoutSuffix}.${ext}`; // Nombre.ext
  }

  /**
   * Remueve '_' y '-' entre otros caracteres (TODO) en el nombre de la función
   * @param {String} strInput cadena de entrada
   * @return {String} retorna la cadena formateada
   */
  _toCamelCase(strInput) {
    return strInput.replace(/-/g, "");
  }
};
