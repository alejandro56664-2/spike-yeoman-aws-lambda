package <%= fullPkg %>;

import <%= pkgBase %>.model.<%= tableName %>;
import java.util.Optional;

public interface I<%= tableName %>Repository {

  /**
   * Obtiene un objeto '<%= tableName %>' de la tabla DynamoDB. No dude en complementar esta documentación y actualizar
   * los tipos de datos del primaryKey y hashKey.
   * @param  <%= primaryKey %> primaryKey
   * @param <%= hashKey %> hashKey
   * @return
   */
  Optional<<%= tableName %>> get(String <%= primaryKey %>, String <%= hashKey %>);

  /**
   * Guarda un objeto '<%= tableName %>' de la tabla DynamoDB. No dude en complementar esta documentación
   * @param obj 
   * @return
   */
  void save(<%= tableName %> obj);
}
