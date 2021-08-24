package <%= fullPkg %>;

import static org.junit.jupiter.api.Assertions.*;
import co.com.dummy.myfunction.model.TableDynamo;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junitpioneer.jupiter.SetSystemProperty;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;

class <%= tableName %>RepositoryImplTest {

  // Hay que tener en cuenta que nuestro repository básicamente es un wrapper para
  // el Objeto DynamoDBTable, por lo que estas pruebas solo sirven para evitar tener una métrica
  // de cobertura de código inferior al 85%, pero estamos claros con que el valor que aportan
  // es bajo.
  @Test
  @DisplayName("Prueba dummy")
  @SetSystemProperty(key = "DYNAMO_DB_TABLE_NAME", value = "tabla")
  @SetSystemProperty(key = "AWS_REGION", value = "us-east-2")
  void saveTest() {
    // Arrange
    TableDynamoRepositoryImpl repo = new TableDynamoRepositoryImpl();

    // Act
    DynamoDbTable<TableDynamo> result = repo.dynamoDbTable();

    // Assert
    assertNotNull(result);
  }
}
