# spike-yeoman-aws-lambda
En esto repo se hace un ejemplo práctico para la generación de lambdas en java para AWS Lambda con Micronaut. 

Presentación sobre scaffolding: [Link Presentación](https://drive.google.com/file/d/1VPAdKpWtnrwXNOUBDUBetq0ytdg4Q65b/view?usp=sharing).

## Objetivo

- Evaluar la herramienta Yeoman para la generación automática de la estructura base de funciones tipo AWS Lambda con el framework Micronaut con el fin de ayudar a los desarrolladores a enfocarse en dar valor al negocio.

## Introducción

El andamiaje como herramienta de meta-programación para la generación de código que permite la automatización de código repetitivo y propenso a errores. No necesitamos reinventar la rueda cada vez, esto ayuda a evitar código “Frankenstein” y estandarizar lo mas que se pueda para enfocarnos en resolver problemas de negocio.

Forzar sistemáticamente ciertas restricciones a nivel de arquitectura de aplicación (en este caso a nivel de lambda)

brinda algún tipo de estructura (rápida, simplificada, a veces externa, a veces temporal) para un proyecto, en la que puede confiar para construir el proyecto real más complejo .. Y al igual que el andamio real, la estructura del andamio está destinada a apoyar el proceso de construcción del proyecto, en lugar del proyecto en sí (con algunas excepciones).

Los generadores de Yeoman son modulos de node.js

```sh
npm install -g yo
```

## Modelo Yeoman
### Run loop

Yeoman ejecuta las tareas en colas, esto permite componer diferentes generadores que se ejecutan concurrentemente.
Para lograr la sincronización se pueden definir prioridades, estas se definen usando nombres especiales de los prototipos: cuando el nombre coincide con el nombre de una prioridad yeoman mueve esta tarea a una cola especial, de lo contrario mueve la tarea a una cola por defecto.

- ```initializing```: tareas de inicialización, revisar estado actual del proyecto, obtener configuraciones.
- ```prompting```: Preguntar por opciones a los usuarios (usando this.prompt())
- ```configuring```: guardar configuraciones, configurar el proyecto (creating .editorconfig files and other metadata files)
- ```default```: Si el método no encaja en ninguna categoría se mueve a esta cola.
- ```writing```: Donde ocurre la magia, aquí se generan los archivos (routes, controllers, etc)
- ```conflicts```: Donde se gestionan los conflictos (usado internamente)
- ```install```: Donde se realizan las instalaciónes (npm, bower, en nuestro caso el gradle)
- ```end```: Se llaman de último, limpieza, despedirse, etc

Hay dos contextos de archivos: 
- ```destination```: Escritura (de archivos generados)
- ```template```: Lectura (de plantillas)

Para reducir los riesgos de errores, Yeoman permite escribir un _filesystem_ en memoria a tráves de una API sincróna, que ademas es compartido por todos los generadores. Esto le permite resolver conflictos con la ayuda de los usuarios.

Importante revisar: https://github.com/sboudrias/mem-fs 

**Cuidado**
Editar archivos existentes es una tarea bastante riesgosa y requiere herramientas sofisticadas. Haga lo que haga no rompa el código de sus usuarios.

## Convención sobre configuración

TODO

## Caso de uso: Service Templates

## Generador de aws lambda con Java + Micronaut

Para simplificar la generación del proyecto se usa el generador de generadores propuesto por Yeoman:

```sh
npm install -g yo generator-generator
```

Tareas:

1. Generar estructura de los templates.

Para generar la estructura del template se usa este proyecto base: https://guides.micronaut.io/latest/mn-application-aws-lambda-java11-gradle-java.html y https://github.com/xvik/generator-lib-java 


2. Definir elementos configurables.

- ¿Agregar el gradle wrapper? (Y/n)
- Nombre del proyecto
- Nombre del paquete base (grupo Maven)
- Nombre de la función
- Evento desencadenador (Ej: HTTP, S3)
- ¿Usar AWS SSM (Es recomendado siempre usar un almacén de parametros)? (Y/n)
- Agregar servicio Backend (Tabla DynamoDB, Servicio REST, Ninguno)
    - repositorio dynamodb:
        - Nombre de la tabla
        - Llave Principal
        - Llave Secundaria
    - cliente webservice rest:
        - Nombre del servicio
        - URL
        - Método HTTP (GET, POST, PUT)

Notas: En el caso de desarrollo de funciones con Java, es posible agrupar varias en un solo repositorio (multiples funciones) si tienen algún tipo
de relación entre ellas o una función por repo.

![casos de uso planteados](./doc/assets/diagramas-casos%20de%20uso-1.png)

3. Estructura de carpetas para los paquetes.

Arquitectura por capas base para lambdas basada en Java y Micronaut.

La estructura de la lambda generada se puede visualizar en el siguiente diagrama:

![arquitectura de referencia lambda](./doc/assets/diagramas-arquitectura%20referencia-1.png)


Restricciones de arquitectura usadas para las lambdas:
- Se debe usar solo un ```Controller``` por Función
- Desde el ```controller``` SOLO puede depender de clases del paquete ```service``` (idealmente 1)
- Desde el paquete ```services``` SOLO se puede depender de clases del mismo paquete o clases de los paquetes ```mapper```, ```clientws```, ```repository```
- Las clases de los paquetes ```mapper```, ```clientws```, ```repository``` NO pueden depender de clases del mismo paquete.
- Las clases de los paquetes ```mapper```, ```clientws```, ```repository``` SOLO pueden depender de los paquetes ```exception```, ```enums```, ```model```.

Se usa ArchUnit para la restricción de las reglas de arquitectura de la aplicación.

TODO (hablar sobre forzar arquitecturas)

4. Códificar pruebas generador.

Hay un generador base que agrega la estructura de la lambda con los paquetes minimos para funcionar. Ademas de los recursos necesarios para la compilación (gradlew)
licencia, configuración git, ide, etc.

Generadores auxiliares:

- Generador de function y controller (```fn-controller```)
- Generador de gestor de la configuración con SSM (```config-manager-ssm```)
- Generador de repository con DynamoDB (```repository-dynamodb```)
- Generador de cliente para servicios REST (```clientws-rest```)
- Generador de services (```services```)

Solo deberían ser invocados por el usuario

- Generador de function-controller
- Generador de repository con DynamoDB
- Generador de cliente para servicios REST
- Generador de services

Cada generador automaticamente genera sus pruebas unitarias o almenos una base para ellas. Incluso el generador del proyecto base, el cuál incluye las restricciones de la arquitectura.

![diagrama de componentes generador](./doc/assets/diagramas-diagrama%20de%20componentes-1.png)

## ¿Cómo extender este generador?

Es posible que a medida que se requiera sea necesario agregar mas generadores auxiliares o modificar los existentes. En esta sección se explica como hacerlo.

Generadores auxiliares deseables:
- Cliente SOAP
- Cache con Redis
- Controller activados por SQS, SNS
- Repository DocumentDB (aka MongoDB)

### ¿Cómo se agrega un evento? Ejemplo práctico para evento SQS

TODO

### ¿Cómo se agrega un componente? Ejemplo práctico generador clientws-rest

### Ventajas:

El template se gestiona cómo una biblioteca nodejs. 

Permite normalizar la creación de microservicios o funciones, reduciendo la variabildad innecesaria, principio fundamental para la creación de arquitectruas evolutivas.

- ¿Qué dificultades tendría para integrarlo en un proceso de CI/CD basado en Gradle?


### Desventajas:

Puede ser realmente complejo, agregar código sobre una base previamente creada, y más aún si esta base no 
fue generada automáticamente por el mismo generador.

El nivel de personalización puede agregar complejidad innecesaria, hay que tener mucho cuidado al elegir que es configurable.
Siempre es útil guiarnos por el patrón de 'Convención sobre configuración' para evitar incrementar accidentalmenta la complejidad.

No es fácil crear generadores para ambientes brownfield, ya que sería necesario 'parsear' el código existente para agregar las modificaciones correctamente. Esta fuera del alcance de este repo, sin embargo podría explorarse el uso de herramientas como JavaParser o Spoon para estos fines.


## Referencias

- https://yeoman.io/authoring/ 
- https://guides.micronaut.io/latest/mn-application-aws-lambda-java11-gradle-java.html
- https://github.com/xvik/generator-lib-java
- https://medium.com/it-dead-inside/using-scaffolding-tools-to-generate-boilerplate-code-d35c2705ac6e
- Neil Ford, Rebecca Parsons, Patrick Kua, Building Evolutionary Architectures.

