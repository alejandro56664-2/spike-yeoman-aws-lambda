"use strict";
const path = require("path");
const assert = require("yeoman-assert");
const helpers = require("yeoman-test");

describe("generator-java-mn-lambda:app con gradlew", () => {
  beforeAll(() => {
    return helpers.run(path.join(__dirname, "../app")).withPrompts({
      // app prompts
      projectName: "projectName",
      pkgBase: "co.demo.projectName",
      useGradlew: true,
      appVersion: "0.1.0",

      // fn prompts
      functionName: "my-function",
      trigger: "generic",

      // config-manager-ssm prompts
      useAwsSSM: false,

      // svc prompts
      serviceName: "Lambda",

      // backend propmts
      backendAdapter: "nothing",
    });
  });

  it("creates files", () => {
    // agregar Controller, Service, ControllerTest, ServiceTest
    assert.file([
      // dot files
      ".editorconfig",
      ".gitattributes",
      ".gitignore",

      //gradle stuff
      "gradle/wrapper/gradle-wrapper.jar",
      "gradle/wrapper/gradle-wrapper.properties",
      "gradlew",
      "gradlew.bat",

      // gradle config
      "build.gradle",
      "java-lambdas-project.gradle",
      "gradle.properties",
      "settings.gradle",

      // other files
      "README.md",
      "template.yml",

      // events
      "events/my-function-generic.json",

      // source files
      "my-function/src/main/java/co/demo/projectName/my/function/model/request/Request.java",
      "my-function/src/main/java/co/demo/projectName/my/function/model/response/Response.java",
      "my-function/src/main/java/co/demo/projectName/my/function/controller/LambdaController.java",
      "my-function/src/main/java/co/demo/projectName/my/function/service/ILambdaService.java",
      "my-function/src/main/java/co/demo/projectName/my/function/service/impl/LambdaServiceImpl.java",

      // test files
      "my-function/src/test/java/co/demo/projectName/my/function/architecture/LayeredArchitectureTest.java",
      "my-function/src/test/java/co/demo/projectName/my/function/controller/LambdaControllerTest.java",
      "my-function/src/test/java/co/demo/projectName/my/function/service/impl/LambdaServiceImplTest.java",
    ]);
  });
});

describe("generator-java-mn-lambda:app sin gradlew", () => {
  beforeAll(() => {
    return helpers.run(path.join(__dirname, "../app")).withPrompts({
      // app prompts
      projectName: "projectName",
      pkgBase: "co.demo.projectName",
      useGradlew: false,
      appVersion: "0.1.0",

      // fn prompts
      functionName: "my-function",
      trigger: "generic",

      // config-manager-ssm prompts
      useAwsSSM: false,

      // svc prompts
      serviceName: "Lambda",

      // backend propmts
      backendAdapter: "nothing",
    });
  });

  it("creates files", () => {
    // agregar Controller, Service, ControllerTest, ServiceTest
    assert.file([
      // dot files
      ".editorconfig",
      ".gitattributes",
      ".gitignore",

      // gradle config
      "build.gradle",
      "java-lambdas-project.gradle",
      "gradle.properties",
      "settings.gradle",

      // other files
      "README.md",
      "template.yml",

      // events
      "events/my-function-generic.json",

      // source files
      "my-function/src/main/java/co/demo/projectName/my/function/model/request/Request.java",
      "my-function/src/main/java/co/demo/projectName/my/function/model/response/Response.java",
      "my-function/src/main/java/co/demo/projectName/my/function/controller/LambdaController.java",
      "my-function/src/main/java/co/demo/projectName/my/function/service/ILambdaService.java",
      "my-function/src/main/java/co/demo/projectName/my/function/service/impl/LambdaServiceImpl.java",

      // test files
      "my-function/src/test/java/co/demo/projectName/my/function/architecture/LayeredArchitectureTest.java",
      "my-function/src/test/java/co/demo/projectName/my/function/controller/LambdaControllerTest.java",
      "my-function/src/test/java/co/demo/projectName/my/function/service/impl/LambdaServiceImplTest.java",
    ]);
  });
});
