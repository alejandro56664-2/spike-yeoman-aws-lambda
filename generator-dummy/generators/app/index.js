var Generator = require('yeoman-generator');

module.exports = class extends Generator {

    // The name `constructor` is important here
    constructor(args, opts) {
        // Calling the super constructor is important so our generator is correctly set up
        super(args, opts);

         // This method adds support for a `--coffee` flag
        this.option("coffee");

        // And you can then access it later; e.g.
        this.scriptSuffix = this.options.coffee ? ".coffee" : ".js";

        this.helper = () => {
            this.log('metodo de instancia')
        }
    }

    initializing() {
        this.composeWith(require.resolve('../turbo'));
        this.composeWith(require.resolve('../electric'));
    }

    method1() {
        this.log('method 1 just ran');
        
    }
    
    method2() {
        this.log('method 2 just ran');
    }

    _helper(){
        this.log('no se ejecuta automaticamente')
    }

    async prompting() {
        this.log('En prompting')
        this.answers = await this.prompt([
          {
            type: "input",
            name: "name",
            message: "Your project name",
            default: this.appname // Default to current folder name
          },
          {
            type: "confirm",
            name: "cool",
            message: "Would you like to enable the Cool feature?"
          }
        ]);

      }

      writing() {
        this.log('En writing')
        this.log("app name", this.answers.name);
        this.log("cool feature", this.answers.cool); // user answer `cool` used

        this.fs.copyTpl(
            this.templatePath('index.html'),
            this.destinationPath('public/index.html'),
            { title: this.answers.name  }
          );
      }

      paths() {
        this.log('destination')
        this.log(this.destinationRoot())
        // returns '~/projects'
    
        this.log(this.destinationPath('index.js'))
        // returns '~/projects/index.js'

        this.log('template')
        this.log(this.sourceRoot())
        // returns './templates'

        this.log(this.templatePath('index.js'))
        // returns './templates/index.js'
      }

    
};