package <%= fullPkg %>;

import <%= pkgBase %>.model.Configuration;
import <%= pkgBase %>.enums.ParamKey;
import io.micronaut.core.annotation.Introspected;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.inject.Singleton;
import lombok.extern.slf4j.Slf4j;


@Introspected
@Singleton
@Slf4j
public class ConfigRetriever {
  Configuration config;

  public ConfigRetriever() {
    
  }

  public Optional<Configuration> getConfiguration() {
    if(config == null){
      try {
        getParameters()
            .map(this::toConfiguration)
            .ifPresent(c -> config = c);
      } catch(Exception e ){
        log.error(e.getMessage());
      }
    }
    return Optional.ofNullable(config);
  }

  private Optional<Map<String, String>> getParameters() throws ParameterStoreTransactionErrorException {
    List<String> paramKeys = Arrays.stream(ParamKey.values())
        .map(ParamKey::getValue)
        .collect(Collectors.toList());

    String functionName = ParamKey.FUNCTION_NAME.getValue();

    return Optional.ofNullable(getParamsMap(paramKeys, functionName));
  }

  private Map<String, String> getParamsMap(List<String> paramKeys, String functionName) {
    //TODO implementar con la dependencias a aws
  }

  private Configuration toConfiguration(Map<String, String> params) {
    return Configuration.builder()
        // TODO: Por favor agregue los parametros necesarios
        .appName(params.get(ParamKey.APPLICATION_NAME.getValue()))
        .build();
  }
}