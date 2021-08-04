'use strict';
const FnGenerator = require('../commons/FnGenerator');
module.exports = class extends FnGenerator{

  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

      this.option('invokedFromFnController');

      //Importante, si va a agregar mas conectores backend debe agregar:
      // - el respectivo generador: 
      //    - clientws-{rest, soap, thrift, rpc, etc}
      //    - repository-{dynamodb, s3, mongodb, mysqldb, etc}
      // Agregar la composición del adaptador en el método 'initializing'
      // Agregar el mapping en el objeto GeneratorFlagMapping del constructor

      //los nombres en las banderas aquí expuestas están acoplados al respectivo generador.
      //tenga cuidado al actualizarlo, asegurese que sea igual en el generador auxiliar.
      this.generatorFlagMapping = {
        'ninguno': 'nothing', // opción por defecto, por favor siempre dejela de primera.
        'repositorio dynamodb': 'repository-dynamodb',
        //Ejemplos para agregar mas 
        //'almacenamiento s3': 'storage-s3',
        //'cliente para servicio REST':'clientws-rest'
        //'cliente para servicio SOAP':'clientws-soap'
      }
  }

  prompting() {
    const prompts = [
      {
        type: 'list',
        name: 'functionName',
        message: '¿Cuál es el nombre de la función a la que desea agregar el adaptador backend?',
        choices: this.config.get('functionsList'),
        default: this.config.get('functionsList').indexOf(this.config.get('functionName')),
        when: !this.options.invokedFromFnController
      },
      {
        type: 'list',
        name: 'backendAdapter',
        message: '¿Qué tipo de adaptador backend desea agregar a la función?',
        choices: Object.keys(this.generatorFlagMapping),
        default: 0
      }
    ];

    return this.prompt(prompts).then(props => {

      const backendAdapter = this.generatorFlagMapping[props.backendAdapter]
      if(backendAdapter != 'nothing'){
        this.config.set(backendAdapter, true)
        
      }

      if(!this.options.invokedFromFnController){
        this.config.set('functionName', props.functionName)
      }

      this.config.save()
    });
  }

  initializing() {
    //agregar aquí todos los generadores de adaptores backend para lambda que se creen
    this.composeWith(require.resolve('../repository-dynamoDB'), {invokedFromBackendManager: true});
  }
}