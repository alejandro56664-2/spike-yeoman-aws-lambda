'use strict';
const FnGenerator = require('../commons/FnGenerator');
const chalk = require('chalk');
const yosay = require('yosay');

/**
 * Para fines prácticos este este el generador raíz. Para mas información refierase al diagrama de componentes
 * en el README.md
 */
module.exports = class extends FnGenerator {

  // Este constructor permite pasar las configuraciones como argumentos de linea de comandos, lo que permite su uso desde 
  // las tuberias de despliegue e integración continua.
  constructor(args, opts) {
      // Calling the super constructor is important so our generator is correctly set up
      super(args, opts);

      // This method adds support for a `--coffee` flag
      //this.option("coffee");
      // And you can then access it later; e.g.
      //this.scriptSuffix = this.options.coffee ? ".coffee" : ".js";

  }

  prompting() {
    // Yeoman saludando al desarrollador
    this.log(
      yosay(
        `Bienvenido al generador ${chalk.red('generator-lambda-java')}!`
      )
    );

    const prompts = [
      {
        type: 'input',
        name: 'projectName',
        message: '¿Cuál es el nombre del proyecto?',
        default: this.appname // Default to current folder name
      },
      {
        type: 'input',
        name: 'pkgBase',
        message: '¿Cuál es el paquete base o grupo?',
        default: `co.com.${this.appname}`
      },
      {
        type: 'confirm',
        name: 'useGradlew',
        message: '¿Desea incluir el Gradle Wrapper?',
        default: true
      },
      {
        type: 'input',
        name: 'appVersion',
        message: '¿Cuál es el la versión?',
        default: '0.1.0' // Default version
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props
      this.config.set("appVersion", props.appVersion)
      this.config.set("pkgBase", props.pkgBase)
      this.config.save()
    });
  }

  initializing() {
    //Indicamos al generador raíz de los generadores especificos
    this.composeWith(require.resolve('../fn'));
  }

  writing() {
   
    if(this.props.useGradlew) {
      this._copyGradleStuff()
    }

    this._copyDotFiles()
    this._copyGradleConfig(this.props)
    this._copyOtherFiles(this.props)
  }

  _copyDotFiles(){
    this.log('Copiando archivos . (Ej: .gitignore)')

    const files = [
      '_editorconfig',
      '_gitattributes',
      '_gitignore'
    ]

    files.forEach(fileName => {
      // se copian los archivos
      this.fs.copy(
        this.templatePath(fileName),
        this.destinationPath(fileName.replace('_', '.'))
      );
    });

  }

  _copyGradleStuff(){
    this.log('Copiando archivos del gradle wrapper')

    const files = [
      'gradle/wrapper/gradle-wrapper.jar',
      'gradle/wrapper/gradle-wrapper.properties',
      'gradlew',
      'gradlew.bat'
    ]

    files.forEach(fileName => {
      // se copian los archivos
      this.fs.copy(
        this.templatePath(fileName),
        this.destinationPath(fileName)
      );
    });

  }
  
  _copyGradleConfig(props) {
    this.log('Copiando archivos de configuración de gradle')

    const files = [
      'build.gradle',
      'java-lambdas-project.gradle',
      'gradle.properties',
      'settings.gradle'
    ]

    files.forEach(fileName => {
      // se copian los archivos
      this.fs.copyTpl(
        this.templatePath(fileName),
        this.destinationPath(fileName),
        {
          projectName: props.projectName,
          appVersion: props.appVersion,
          group: props.pkgBase
        }
      );
    });
  }

  _copyOtherFiles(props){
    //Aqui se pondría README.md
    this.log('Copiando archivos de documentación y demás')

    const files = [
      'README.md',
      'template.yml'
    ]

    files.forEach(fileName => {
      // se copian los archivos
      this.fs.copyTpl(
        this.templatePath(fileName),
        this.destinationPath(fileName),
        {
          projectName: props.projectName,
          appVersion: props.appVersion,
          pkgBase: props.pkgBase
        }
      );
    });
  }

  install() {
    //this.installDependencies();
  }
};
