
## Run <%= functionName %> local with SAM

Handler: <%= pkgBase %>.controller.LambdaController::execute

```bash
sam local invoke <%= functionNameCamelCase %> --event ./<%= eventFile %>
```
