package <%= fullPkg %>;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbSortKey;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@DynamoDbBean
@FieldDefaults(level = AccessLevel.PRIVATE)
public class <%= tableName %> {
  String <%= partitionKey %>;
  String <%= sortKey %>;
  String name;
  //TODO: agregue los campos necesarios

  @DynamoDbPartitionKey
  public String get<%= partitionKey %>() {
    return <%= partitionKey %>;
  }

  @DynamoDbSortKey
  public String get<%= sortKey %>() {
    return <%= sortKey %>;
  }
}
