'use strict';
const Generator = require('yeoman-generator');
module.exports = class extends Generator{

  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
  }

  /**
   * Permite obtener el fqn de una clase
   * @param {String} pkgBase nombre del grupo o paquete base
   * @param {String} fileName nombre del archivo 
   * @returns 
   */
    _getFullPkgHelper(pkgBase, fileName){
        const path = fileName.split('/')
        //quitamos el nombre del archivo
        const pathWithoutFileName = path.slice(0, path.length - 1)
        if(pathWithoutFileName.length == 0){
          return pkgBase
        } else {
          return pkgBase + "." + pathWithoutFileName.join('.')
        }
      }

    /**
     * Permite copiar una lista de archivos de recursos.
     * @param {Map} props mapa con las propiedades/configuraciones definidas por el usuario
     * @param {String} prefixTemplatePath 
     * @param {Array} files lista de Strings con los nombres de los archivos
     */
    _copyRscHelper(props, prefixTemplatePath, files){
      const functionName = props.functionName
      const prefixDestinationPath = `${functionName}/${prefixTemplatePath}`
      
      
      files.forEach(fileName => {
        // se copian los archivos
        this.fs.copyTpl(
          this.templatePath(`${prefixTemplatePath}/${fileName}`),
          this.destinationPath(`${prefixDestinationPath}/${fileName}`),
          props
        );
      });
    }
    
    /**
     * Permite copiar una lista de archivos fuente y cambiarle el nombre a cada archivo mediane una función 'transformName'.
     * @param {Map} props mapa con los valores a reemplazar en las plantillas (para esta función debe incluir 'pkgBase' y 'functionNameCamelCase')
     * @param {String} prefixTemplatePath prefijo de la ruta donde se encuentran los archivos fuente, normalmente 'src/main/java/pkgBase'
     * @param {Array} files lista con los nombres de las plantillas de los archivos fuentes archivos 
     * @param {Function} transformName función que permite realizar algún tipo de transformación sobre el nombre de cada plantilla.
     */
    _copySrcWithOtherNameHelper(props, prefixTemplatePath, files, transformName){
      
      const functionName = props.functionName
      const pkgBase = props.pkgBase
      const pkgBasePath = pkgBase.replace(/\./g, '/')
      const prefixDestinationPath = `${functionName}/${prefixTemplatePath.replace('pkgBase', pkgBasePath)}`
      
      files.forEach(fileName => {
        // se copian los archivos

        props.fullPkg = this._getFullPkgHelper(pkgBase, fileName)
        this.fs.copyTpl(
          this.templatePath(`${prefixTemplatePath}/${fileName}`),
          this.destinationPath(`${prefixDestinationPath}/${transformName(fileName)}`),
          props
        );
      });
    }

    /**
     * Permite copiar una lista de archivos fuente.
     * @param {Map} props mapa con los valores a reemplazar en las plantillas (para esta función debe incluir 'pkgBase')
     * @param {String} prefixTemplatePath prefijo de la ruta donde se encuentran los archivos fuente, normalmente 'src/main/java/pkgBase'
     * @param {Array} files lista con los nombres de las plantillas de los archivos fuentes archivos 
     * @param {Function} transformName función que permite realizar algún tipo de transformación sobre el nombre de cada plantilla.
     */
     _copySrcHelper(props, prefixTemplatePath, files){
      // pasamos una función 'By Pass' como método de transformación 
      this._copySrcWithOtherNameHelper(props, prefixTemplatePath, files, (fileName) => fileName )
    }

      /**
   * Adiciona a un archivo, un fragmento de una plantilla populado con los valores en 'props'.
   * @param {Map} props mapa con los valores a reemplazar en la plantilla.
   * @param {String} sourceSnippetTplPath ruta a la plantilla del fragmento.
   * @param {String} destinationFilePath  ruta del archivo al que se le va a agregar al final la plantilla populada.
   */
  _appendHelper(props, sourceSnippetTplPath, destinationFilePath){
    const snippetTempPath = this.destinationPath(`${sourceSnippetTplPath}.temp`)

    //se popula el fragmento de código y se guarda en un archivo temporal
    this.fs.copyTpl(
      this.templatePath(sourceSnippetTplPath),
      snippetTempPath,
      props
    );

    //luego leemos el fragmento populado, lo agregamos a los archivos existentes, eliminamos archivo temporal
    const snippetPopulated = this.fs.read(snippetTempPath)
    this.fs.append(this.destinationPath(destinationFilePath), snippetPopulated)
    this.fs.delete(snippetTempPath)
  }

  /**
   * Agrega al script 'build.gradle' local de la función el fragmento definido en 'build-snippet.gradle'
   * ademas agrega en el 'gradle.properties' común las propiedades definidas en 'gradle-snippet.properties'
   * Valida a través de banderas que a pesar de que se invoque varias veces este método solo las agrega una vez. 
   * @param {Map} props mapa con los valores a reemplazar en la plantilla.
   * @param {String} flagName nombre de la bandera de la configuración
   */
  _appendLocalDependency(props, flagName){

    const functionName = props.functionName
    const snippetsExist = (snippetName) => this.fs.exists(this.templatePath(snippetName))

    //aquí hay una oportunidad de mejora, idealmente el estado debería permanecer en la fuente misma de verdad
    //que deberían ser los archivos gradle, sin embargo 'parsearlos' puede agregar una complejidad innecesaria.
    //obtenemos el objeto con las dependencias:
    let functionDependencies = this.config.get(functionName) || {}
    const dependenciesNotAppended = !functionDependencies[flagName]
    if(dependenciesNotAppended) {
      this.log(`Se agregan las ${flagName} locales los archivos gradle, para la función: ${functionName}`)

      if(snippetsExist('build-snippet.gradle')){
        this._appendHelper(props, 'build-snippet.gradle', `${functionName}/build.gradle`)
      }
      if(snippetsExist('gradle-snippet.properties')){
        this._appendHelper(props, 'gradle-snippet.properties', 'gradle.properties')
      }

      //agregamos el estado actualizado a la configuración 
      functionDependencies[flagName] = true
      this.config.set(functionName, functionDependencies)
    }
  }


  /**
   * Lee un parametro de la configuración y lo elimina
   * @param {*} configKey 
   * @returns 
   */
  _readAndDelete(configKey) {
    const result = this.config.get(configKey)
    this.config.delete(configKey)
    this.log(`Leyendo y eliminando: ${configKey}: ${result}`)
    return result;
  }

  /**
   * Valida si el nombre ingresado no tiene espacios o simbolos.
   * @param {String} name 
   * @returns 
   */
  _validateCamelCase(name){
    //TODO
    return true
  }

  /**
   * Remueve '_' y '-' entre otros caracteres (TODO) en el nombre de la función
   * @param {String} strInput 
   * @returns 
   */
  _toCamelCase(strInput){
    return strInput.replace(/\-/g, '')
  }
}