package <%= fullPkg %>;

import <%= pkgBase %>.model.<%= tableName %>;
import java.util.Optional;

public interface I<%= tableName %>Repository {

  /**
   * Guarda un objeto '<%= tableName %>' de la tabla DynamoDB. No dude en complementar esta documentación
   * @param obj 
   * @return <%= tableName %>
   */
  <%= tableName %> save(<%= tableName %> obj);

  List<<%= tableName %>> findAll();

  Optional<<%= tableName %>> findOne(String name);

  Optional<<%= tableName %>>  deleteOne(String name);

}
