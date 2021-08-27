"use strict";
const path = require("path");
const assert = require("yeoman-assert");
const helpers = require("yeoman-test");
/**
 * Se agrega una función adicional a una base ya creada.
 */
describe("generator-java-mn-lambda:fn", () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, "../fn"))
      .withOptions({
        invokedFromFnController: false, //esto evita preguntar a que función agregar el repo
      })
      .withLocalConfig({
        functionsList: ["my-function, my-function2"],
        functionName: "my-function",
        projectName: "projectName",
        pkgBase: "co.demo.projectName",
        "my-function": {
          "fn-controller-dependencies": true,
          "config-manager-ssm-dependencies": true
        },
        "my-function2": {
          "fn-controller-dependencies": true,
          "config-manager-ssm-dependencies": true
        }

      })
      .withPrompts({
        // backend propmts
        backendAdapter: "ninguno",
        functionName: "my-function3",
        trigger: "s3"
      });
  });

  it("no crea archivos", () => {
    //Evaluar que no debe crear archivos
    // events
    assert.file([
      "events/my-function3-s3.json",

      // source files
      "my-function3/src/main/java/co/demo/projectName/my/function3/model/request/Request.java",
      "my-function3/src/main/java/co/demo/projectName/my/function3/model/response/Response.java",
      "my-function3/src/main/java/co/demo/projectName/my/function3/controller/LambdaController.java",
      "my-function3/src/main/java/co/demo/projectName/my/function3/service/ILambdaService.java",
      "my-function3/src/main/java/co/demo/projectName/my/function3/service/impl/LambdaServiceImpl.java",

      // test files
      "my-function3/src/test/java/co/demo/projectName/my/function3/architecture/LayeredArchitectureTest.java",
      "my-function3/src/test/java/co/demo/projectName/my/function3/controller/LambdaControllerTest.java",
      "my-function3/src/test/java/co/demo/projectName/my/function3/service/impl/LambdaServiceImplTest.java"
    ])
  });
});