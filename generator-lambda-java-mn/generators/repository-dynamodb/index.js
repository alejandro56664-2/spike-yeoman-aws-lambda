"use strict";
const FnGenerator = require("../commons/FnGenerator");
/**
 * Generador de repository con DynamoDB para la función.
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
    this.option("invokedFromBackendManager");
    this.option("useThisGenerator");
  }

  /**
   * Cola para consultar al usuario
   * @return {Promise} promesa de los valores ingresados por el usuario
   */
  prompting() {
    // este valor esta acoplado con el la lista del backend-manager, si lo cambia aquí,
    // debe cambiarlo allá también. Trate de usar por convención el nombre del generador
    this.useThisGenerator =
      this.options.useThisGenerator ||
      this._readAndDelete("repository-dynamodb");

    const prompts = this.useThisGenerator
      ? [
          {
            type: "list",
            name: "functionName",
            message:
              "¿Cuál es el nombre de la función a la que desea agregar el repositorio?",
            choices: this.config.get("functionsList"),
            default: this.config
              .get("functionsList")
              .indexOf(this.config.get("functionName")),
            when: !this.options.invokedFromBackendManager,
          },
          {
            type: "input",
            name: "tableName",
            message:
              "¿Cuál es el nombre de la tabla DynamoDB? (Escribe el nombre en formato CamelCase)",
            default: "TableDynamo",
          },
          {
            type: "input",
            name: "hashKey",
            message:
              "¿Cual es el nombre de la llave primaria (o Hash) de la tabla?",
            default: "hashKey",
          },
          {
            type: "input",
            name: "rangeKey",
            message:
              "¿Cual es el nombre de la llave secundaria (o Range) de la tabla?",
            default: "rangeKey",
          },
        ]
      : [];

    return this.prompt(prompts).then((props) => {
      // To access props later use this.props.someAnswer;
      this.props = props;
      if (this.options.invokedFromBackendManager) {
        this.props.functionName = this.config.get("functionName");
      }
      this.props.pkgBase = `${this.config.get("pkgBase")}.${this._toPkg(
        this.props.functionName
      )}`;
    });
  }

  /**
   * Cola de escritura
   */
  writing() {
    // se copia los archivos fuente del repository, solo si se debe agregar:
    if (this.useThisGenerator) {
      // Agregamos las propiedades, solo si se usa el generador.
      this.props.tableName = this._firstCapital(this.props.tableName);
      this.props.HashKey = this._firstCapital(this.props.hashKey);
      this.props.RangeKey = this._firstCapital(this.props.rangeKey);

      this._copySrc(this.props);
    }
  }

  /**
   * Método privado que sirve para agrupar las tareas de generación de código fuente
   * @param {Map} props retorna un Mapa con valores útiles para reemplazar en las plantillas
   */
  _copySrc(props) {
    this.log(
      `Copiando archivos fuente del repository, con el paquete base: ${props.pkgBase}`
    );
    // se copian los archivos principales
    const filesMain = [
      "backend/repository/ITableNameRepository.java",
      "backend/repository/impl/TableNameRepositoryImpl.java",
      "model/TableName.java",
    ];

    const replaceTableName = (fileName) =>
      fileName.replace("TableName", this.props.tableName);
    // copiamos, pero transformamos el nombre reemplazando la palabra 'Lambda' en el nombre de la plantilla
    // por el nombre de la tabla que eligió el usuario (TODO)
    this._copySrcWithOtherNameHelper(
      props,
      "src/main/java/pkgBase",
      filesMain,
      replaceTableName
    );

    // se copian las archivos de pruebas
    // TODO hacer los test generales
    const filesTest = [
      "backend/repository/impl/TableNameRepositoryImplTest.java",
    ];
    this._copySrcHelper(
      props,
      "src/test/java/pkgBase",
      filesTest,
      replaceTableName
    );

    // agregamos las dependencias
    this._appendLocalDependency(props, "repository-dynamodb-dependencies");
  }
};
