'use strict';
const FnGenerator = require('../commons/FnGenerator');
/**
 * Generador de repository con DynamoDB para la función.
 */
module.exports = class extends FnGenerator {

  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
    this.option('invokedFromBackendManager');
      
  }

    initializing(){

    }

    prompting() {

        //este valor esta acoplado con el la lista del backend-manager, si lo cambia aquí,
        //debe cambiarlo allá también. Trate de usar por convención el nombre del generador
        this.useThisGenerator = this._readAndDelete('repository-dynamodb')
        this.log(`useThisGenerator -> repository-dynamodb: ${this.useThisGenerator}`)

        const prompts = this.useThisGenerator ?
        [
          {
            type: 'list',
            name: 'functionName',
            message: '¿Cuál es el nombre de la función a la que desea agregar el repositorio?',
            choices: this.config.get('functionsList'),
            default: this.config.get('functionsList').indexOf(this.config.get('functionName')),
            when: !this.options.invokedFromBackendManager
          },
          {
            type: 'input',
            name: 'tableName',
            message: '¿Cuál es el nombre de la tabla DynamoDB?',
            default: 'TableDynamo'
          },
          {
            type: 'input',
            name: 'primaryKey',
            message: '¿Cual es el nombre de la llave primaria de la tabla?',
            default: 'primaryKey'
          },
          {
            type: 'input',
            name: 'hashKey',
            message: '¿Cual es el nombre de la llave secundaria (o Hash) de la tabla?',
            default: 'hashKey'
          }
        ]:[]
    
        return this.prompt(prompts).then(props => {
          // To access props later use this.props.someAnswer;
          this.props = props 
          if(this.options.invokedFromBackendManager) {
            this.props.functionName = this.config.get('functionName')
          }
          this.props.pkgBase = `${this.config.get("pkgBase")}.${this._toCamelCase(this.props.functionName )}`
          
        });
      }
      
    
      writing() {
        // se copia los archivos fuente del repository, solo si se debe agregar:
        if(this.useThisGenerator) {
          this._copySrc(this.props)
        }
      }


    _copySrc(props) {
      this.log(`Copiando archivos fuente del repository, con el paquete base: ${props.pkgBase}`)
      //se copian los archivos principales
      const filesMain = [
        'backend/repository/ITableNameRepository.java',
        'backend/repository/impl/TableNameRepositoryImpl.java',
        'model/TableName.java'
      ]

      const replaceTableName = (fileName) =>  fileName.replace('TableName', this.props.tableName)
      // copiamos, pero transformamos el nombre reemplazando la palabra 'Lambda' en el nombre de la plantilla
      // por el nombre de la tabla que eligió el usuario (TODO)
      this._copySrcWithOtherNameHelper(props, 'src/main/java/pkgBase', filesMain, replaceTableName)
      

      //se copian las archivos de pruebas
      //TODO hacer los test generales
      const filesTest = [
        'backend/repository/impl/TableNameRepositoryImplTest.java'
      ]
      this._copySrcHelper(props, 'src/test/java/pkgBase', filesTest, replaceTableName)

      //agregamos las dependencias
      this._appendLocalDependency(props, 'repository-dynamodb-dependencies')
    }
}