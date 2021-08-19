package <%= fullPkg %>;

import <%= pkgBase %>.model.<%= tableName %>;
import <%= pkgBase %>.repository.I<%= tableName %>Repository;
import java.util.Optional;
import javax.inject.Singleton;
import lombok.extern.slf4j.Slf4j;

import javax.validation.Valid;
import lombok.val;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;

@Singleton
@Slf4j
public class <%= tableName %>RepositoryImpl implements I<%= tableName %>Repository {

  public <%= tableName %> save(@Valid <%= tableName %> obj) {

        val table = dynamoDbTable();
        val register = <%= tableName %>.builder()
            //TODO: haga el mapeo completo y agregue campos que solo estarán disponibles en el almacenamiento
            //como ids, timestamp, etc.
            .build();
        table.putItem(register);
        return register;
    }

    public List<<%= tableName %>> findAll() {
        val registers = new ArrayList<<%= tableName %>>();
        val table = dynamoDbTable();
        val results = table.scan().items().iterator();
        while (results.hasNext()) {
            registers.add(results.next());
        }
        return registers;
    }

    public Optional<<%= tableName %>> findOne(String name) {
        val table = dynamoDbTable();
        val key = Key.builder().partitionValue(AttributeValue.builder().s(name).build()).build();
        return Optional.ofNullable(table.getItem( r -> r.key(key)));
    }

    public Optional<<%= tableName %>>  deleteOne(String name) {
        val table = dynamoDbTable();
        val key = Key.builder().partitionValue(AttributeValue.builder().s(name).build()).build();
        return Optional.ofNullable(table.deleteItem (r -> r.key(key) ));
    }

    private DynamoDbTable<<%= tableName %>> dynamoDbTable() {
        //TODO considere agregar estos parametros en el parameter store
        String tableName = System.getenv("DYNAMO_DB_TABLE_NAME");
        String envRegion = System.getenv("AWS_REGION");
        Region region = Region.of(envRegion);

        val dynamoDbClient = DynamoDbClient.builder()
            .region(region)
            .build();

        val dynamoDbClientEnhancedClient = DynamoDbEnhancedClient.builder()
            .dynamoDbClient(dynamoDbClient)
            .build();

        return dynamoDbClientEnhancedClient
            .table(tableName, TableSchema.fromBean(<%= tableName %>.class));
    }
}
