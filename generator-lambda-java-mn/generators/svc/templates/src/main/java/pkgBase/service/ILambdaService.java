package <%= fullPkg %>;
 
import <%= pkgBase %>.model.response.Response;

public interface I<%= serviceName %>Service {
  /**
   * Por favor describa brevemente el objetivo de cada método del servicio
   * @param message
   * @return
   */
  Response get(String message);
}
