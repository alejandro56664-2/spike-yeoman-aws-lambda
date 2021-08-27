"use strict";
const path = require("path");
const assert = require("yeoman-assert");
const helpers = require("yeoman-test");
/**
 * Todos los componentes backend debería ser invocados por usuario a través del generador 'Backend'
 */
describe("generator-java-mn-lambda:backend nothing", () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, "../backend"))
      .withOptions({
        invokedFromFnController: false, //esto evita preguntar a que función agregar el repo
      })
      .withLocalConfig({
        functionsList: ["my-function"],
        functionName: "my-function",
        projectName: "projectName",
        pkgBase: "co.demo.projectName",
      })
      .withPrompts({
        // backend propmts
        backendAdapter: "ninguno",
        functionName: "my-function",
      });
  });

  it("no crea archivos", () => {
    //Evaluar que no debe crear archivos
  });
});

describe("generator-java-mn-lambda:backend repository-dynamodb", () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, "../backend"))
      .withOptions({
        invokedFromFnController: false, //esto evita preguntar a que función agregar el repo
      })
      .withLocalConfig({
        functionsList: ["my-function"],
        functionName: "my-function",
        projectName: "projectName",
        pkgBase: "co.demo.projectName",
      })
      .withPrompts({
        // backend propmts
        backendAdapter: "repositorio dynamodb",
        functionName: "my-function",
      });
  });

  it("change config", () => {
    //evaluar que se guarda en configuración la bandera de la configuración 
   
  });
});
