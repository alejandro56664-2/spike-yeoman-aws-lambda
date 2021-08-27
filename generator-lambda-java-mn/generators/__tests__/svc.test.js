"use strict";
const path = require("path");
const assert = require("yeoman-assert");
const helpers = require("yeoman-test");

describe("generator-java-mn-lambda:svc", () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, "../svc"))
      .withLocalConfig({
        functionsList: ["my-function"],
        functionName: "my-function",
        projectName: "projectName",
        pkgBase: "co.demo.projectName",
      })
      .withPrompts({
        // backend propmts
        functionName: "my-function",
        serviceName: "Backend",
      });
  });

  it("crea archivos", () => {
    assert.file([
      //Evaluar que no debe crear archivos
      "my-function/src/main/java/co/demo/projectName/my/function/service/IBackendService.java",
      "my-function/src/main/java/co/demo/projectName/my/function/service/impl/BackendServiceImpl.java",

      // test files
      "my-function/src/test/java/co/demo/projectName/my/function/service/impl/BackendServiceImplTest.java",
    ]);
  });
});

describe("generator-java-mn-lambda:svc failed", () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, "../svc"))
      .withLocalConfig({
        functionsList: ["my-function"],
        functionName: "my-function",
        projectName: "projectName",
        pkgBase: "co.demo.projectName",
      })
      .withPrompts({
        // backend propmts
        functionName: "my-function",
        serviceName: "Lambda",
      });
  });

  it("crea archivos", () => {
    assert.noFile([
      //Evaluar que no debe crear archivos
      "my-function/src/main/java/co/demo/projectName/my/function/service/IBackendService.java",
      "my-function/src/main/java/co/demo/projectName/my/function/service/impl/BackendServiceImpl.java",

      // test files
      "my-function/src/test/java/co/demo/projectName/my/function/service/impl/BackendServiceImplTest.java",
    ]);
  });
});
