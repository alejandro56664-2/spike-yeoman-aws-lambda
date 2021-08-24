"use strict";
const path = require("path");
const assert = require("yeoman-assert");
const helpers = require("yeoman-test");
/**
 * Todos los componentes backend debería ser invocados por usuario a través del generador 'Backend'
 */
describe("generator-java-mn-lambda:repository-dynamodb", () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, "../repository-dynamodb"))
      .withOptions({
        invokedFromBackendManager: false, //esto evita preguntar a que función agregar el repo
        useThisGenerator: true,
      })
      .withLocalConfig({
        functionsList: ["my-function"],
        functionName: "my-function",
        projectName: "projectName",
        pkgBase: "co.demo.projectName",
      })
      .withPrompts({
        // backend propmts
        backendAdapter: "repository-dynamodb",
        functionName: "my-function",
        // repository-dynamodb
        tableName: "Table",
        hashKey: "hashKey",
        rangeKey: "rangeKey",
      });
  });

  it("creates files", () => {
    // agregar Controller, Service, ControllerTest, ServiceTest
    assert.file([
      // source files
      "my-function/src/main/java/co/demo/projectName/myfunction/backend/repository/impl/TableRepositoryImpl.java",
      "my-function/src/main/java/co/demo/projectName/myfunction/backend/repository/ITableRepository.java",
      "my-function/src/main/java/co/demo/projectName/myfunction/model/Table.java",

      // test files
      //"my-function/src/test/java/co/demo/projectName/myfunction/backend/repository/impl/TableRepositoryImplTest.java"
    ]);
  });
});
