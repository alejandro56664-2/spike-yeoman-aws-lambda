"use strict";
const FnGenerator = require("../commons/FnGenerator");
/**
 * Generador de servicios para la función. Se supone que las funciones tienen responsabilidades muy especificas
 * por lo tanto se espera una pequeña cantidad de servicios por función. Los servicios son el único punto donde debería
 * residir lógica de negocio.
 */
module.exports = class extends FnGenerator {
  /**
   * constructor del generador
   * @param {*} args args
   * @param {*} opts opts
   */
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
    this.option("invokedFromFnController");
  }

  /**
   * Cola para consultar al usuario
   * @return {Promise} promesa de los valores ingresados por el usuario
   */
  prompting() {
    const prompts = [
      {
        type: "list",
        name: "functionName",
        message:
          "¿Cuál es el nombre de la función a la que desea agregar el repositorio?",
        choices: this.config.get("functionsList"),
        default: this.config
          .get("functionsList")
          .indexOf(this.config.get("functionName")),
        when: !this.options.invokedFromFnController,
      },
      {
        type: "input",
        name: "serviceName",
        message: '¿Cuál es el nombre del "service" (sin espacios y CamelCase)?',
        default: "MyService",
        validate: (res) => this._validateCamelCase(res) && res !== "Lambda", // Solo puede haber un servicio Lambda
        // solo se pregunta el nombre cuando no fue pasado por argumento o no está en la configuración
        when: (_) =>
          this.options.invokedFromFnController === null ||
          this.options.invokedFromFnController === undefined,
      },
    ];

    return this.prompt(prompts).then((props) => {
      this.props = props;

      // suponemos que:
      // - si se el nombre del servicio es 'Lambda' (por defecto y muy acoplado a fn-controller)
      //   entonces debemos tomar el nombre de la configuración, porque la invocación es desde fn-controller

      if (this.options.invokedFromFnController) {
        this.props.serviceName = "Lambda"; // nombre por defecto cuando es invocado por el FnController
        this.props.functionName = this.config.get("functionName");
      }

      this.props.pkgBase = `${this.config.get("pkgBase")}.${this._toPkg(
        this.props.functionName
      )}`;
      this.log(
        `Para la generación del servicio usamos temporalmente el paquete: ${this.props.pkgBase}`
      );
    });
  }

  /**
   * Cola de escritura
   */
  writing() {
    // se copia el archivo fuente de la función con un controlador
    this._copySrc(this.props);
  }

  /**
   * Método privado que permite identificar si el nombre del servicio No se encuentra
   * en el objeto Opts. Esto es debido a que se puede invocar el generador svc para
   * contextos Brownfield y el nombre del servicio puede llegar por una bandera de opción
   * en el cli.
   * @return {Boolean}
   */
  _serviceNameNotInOpts() {
    return Object.prototype.hasOwnProperty.call(this.options, "serviceName");
  }

  /**
   * Método privado que sirve para agrupar las tareas de generación de código fuente
   * @param {Map} props retorna un Mapa con valores útiles para reemplazar en las plantillas
   */
  _copySrc(props) {
    this.log(
      `Copiando archivos fuente del service, con el paquete base: ${props.pkgBase}`
    );
    // se copian los archivos principales
    const filesMain = [
      "service/ILambdaService.java",
      "service/impl/LambdaServiceImpl.java",
    ];

    // copiamos, pero transformamos el nombre reemplazando la palabra 'Lambda' en el nombre de la plantilla
    // por el que eligió el usuario.
    this._copySrcWithOtherNameHelper(
      props,
      "src/main/java/pkgBase",
      filesMain,
      (fileName) => fileName.replace("Lambda", this.props.serviceName)
    );

    // se copian las archivos de pruebas
    // TODO hacer los test generales
    const filesTest = ["service/impl/LambdaServiceImplTest.java"];
    this._copySrcWithOtherNameHelper(
      props,
      "src/test/java/pkgBase",
      filesTest,
      (fileName) => fileName.replace("Lambda", this.props.serviceName)
    );
  }
};
