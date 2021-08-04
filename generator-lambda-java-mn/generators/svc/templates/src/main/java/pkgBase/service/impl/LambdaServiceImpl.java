package <%= fullPkg %>;

import <%= pkgBase %>.model.response.Response;
import <%= pkgBase %>.config.ConfigRetriever;
import <%= pkgBase %>.service.I<%= serviceName %>Service;
import javax.inject.Inject;
import javax.inject.Singleton;
import lombok.extern.slf4j.Slf4j;

@Singleton
@Slf4j
public class <%= serviceName %>ServiceImpl implements I<%= serviceName %>Service {

  @Inject ConfigRetriever configRetriever;

  @Override
  public Response get(String message) {
    configRetriever
        .getConfiguration()
        .ifPresent(c -> log.info("Configuración disponible: {}", c.toString()));

    return Response.builder().message("echo: " + message).build();
  }
}
