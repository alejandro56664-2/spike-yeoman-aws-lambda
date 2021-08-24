package <%= fullPkg %>;
 
import <%= pkgBase %>.model.<%= tableName %>;
import java.util.List;
import java.util.Optional;

public interface I<%= tableName %>Repository {

  /**
   * Guarda un objeto '<%= tableName %>' de la tabla DynamoDB. No dude en complementar esta documentación.
   * @param obj 
   * @return <%= tableName %> retorna un instancia del objeto guardado en la tabla.
   */
  <%= tableName %> save(<%= tableName %> obj);

  /**
   * Encuentra todos los objetos guardados en la tabla.
   */
  List<<%= tableName %>> findAll();

  /**
   * Encuentra exactamente el objeto usando la llave primaria y secundaria
   * @param hashKey Llave primaria 
   * @param rangeKey Llave primaria 
   * @return Optional retorna un objeto opcional.
   */
  Optional<<%= tableName %>> findOne(String <%= hashKey %>, String  <%= rangeKey %>);

  /**
   * elimina un objeto usando la llave primaria y secundaria
   * @param hashKey Llave primaria 
   * @param rangeKey Llave primaria 
   * @return Optional retorna un objeto opcional.
   */
  Optional<<%= tableName %>> deleteOne(String <%= hashKey %>, String  <%= rangeKey %>);

}
