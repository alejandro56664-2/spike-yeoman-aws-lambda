
## Run <%= functionName %> local with SAM

Handler: <%= pkgBase %>.<%=  %>.controller.LambdaController::execute

```bash
sam local invoke <%=  %> --event ./<%= eventFile %>
```
