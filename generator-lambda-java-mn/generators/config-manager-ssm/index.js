"use strict";
const FnGenerator = require("../commons/FnGenerator");
/**
 * Generador del gestor de la configuración. Solo puede haber uno por función. Por defecto la configuración
 * se guarda en el parameter store del AWS System Manager.
 */
module.exports = class extends FnGenerator {
  /**
   * Cola para consultar al usuario
   * @return {Promise} promesa de los valores ingresados por el usuario
   */
  prompting() {
    const prompts = [
      {
        type: "confirm",
        name: "useAwsSSM",
        message: "¿Desea gestionar la configuración con el servicio AWS SSM?",
        default: true,
      },
    ];

    return this.prompt(prompts).then((props) => {
      // To access props later use this.props.someAnswer;
      this.props = props;
      this.props.functionName = this.config.get("functionName");
      this.props.pkgBase = `${this.config.get("pkgBase")}.${this._toCamelCase(
        this.props.functionName
      )}`;
    });
  }

  /**
   * Cola de escritura
   */
  writing() {
    this._copySrc(this.props);
  }

  /**
   * Método privado que sirve para agrupar todas las operaciones de escritura de código fuente
   * @param {*} props
   */
  _copySrc(props) {
    this.log(
      `Copiando archivos fuente del gestor de configuración, con el paquete base: ${props.pkgBase}`
    );
    // se copian los archivos principales
    const filesMain = [
      "config/ConfigRetriever.java",
      "enums/ParamKey.java",
      "model/Configuration.java",
    ];
    this._copySrcHelper(props, "src/main/java/pkgBase", filesMain);

    // agregamos las dependencias
    this._appendLocalDependency(props, "config-manager-ssm-dependencies");
  }
};
