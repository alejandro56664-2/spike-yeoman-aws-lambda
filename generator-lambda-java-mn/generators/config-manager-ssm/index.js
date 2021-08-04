'use strict';
const FnGenerator = require('../commons/FnGenerator');
/**
 * Generador del gestor de la configuración. Solo puede haber uno por función. Por defecto la configuración 
 * se guarda en el parameter store del AWS System Manager.
 */
module.exports = class extends FnGenerator {
    prompting() {

        const prompts = [
            {
                type: 'confirm',
                name: 'useAwsSSM',
                message: '¿Desea gestionar la configuración con el servicio AWS SSM?',
                default: true
            }
        ];
    
        return this.prompt(prompts).then(props => {
          // To access props later use this.props.someAnswer;
          this.props = props
          this.props.functionName = this.config.get("functionName")
          this.props.pkgBase = `${this.config.get("pkgBase")}.${this._toCamelCase(this.props.functionName)}`
        })
    }
    writing() {
        this._copySrc(this.props)
    }

    _copySrc(props) {
        this.log(`Copiando archivos fuente del gestor de configuración, con el paquete base: ${props.pkgBase}`)
        //se copian los archivos principales
        const filesMain = [
          'config/ConfigRetriever.java',
          'enums/ParamKey.java',
          'model/Configuration.java'
        ]
        this._copySrcHelper(props, 'src/main/java/pkgBase', filesMain )

        //agregamos las dependencias
        this._appendLocalDependency(props, 'config-manager-ssm-dependencies')
    }
}