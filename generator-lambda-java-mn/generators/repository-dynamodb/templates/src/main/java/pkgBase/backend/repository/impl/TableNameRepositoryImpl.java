package <%= fullPkg %>;

import <%= pkgBase %>.model.<%= tableName %>;
import <%= pkgBase %>.repository.I<%= tableName %>Repository;
import java.util.Optional;
import javax.inject.Singleton;
import lombok.extern.slf4j.Slf4j;

import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;

@Singleton
@Slf4j
public class <%= tableName %>RepositoryImpl implements I<%= tableName %>Repository {

  private DynamoDB dynamoDB;
  final static String TABLE_NAME = "<%= tableName %>";

  public <%= tableName %>RepositoryImpl() {
    this.dynamoDB = new DynamoDB(AmazonDynamoDBClientBuilder.standard().withRegion(Regions.US_EAST_2).build());
  }

  @Override
  public Optional<<%= tableName %>> get(String <%= primaryKey %>, String <%= hashKey %>) {
    //TODO por favor agregue los demas campos necesarios
    return Optional.of(<%= tableName %>.builder().build());
  }

  @Override
  public void save(<%= tableName %> obj) {
    
    dynamoDB.getTable(TABLE_NAME)
            .putItem(buildItem(obj));
  }

  protected Item buildItem(final <%= tableName %> obj) {
    //TODO
    return new Item();
        //.withPrimaryKey("<%= primaryKey %>", obj.get<%= primaryKey %>())
        //.withString("<%= hashKey %>", obj.get<%= hashKey %>());
  }
}
