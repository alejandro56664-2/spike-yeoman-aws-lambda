package <%= fullPkg %>;
 
import io.micronaut.core.annotation.Introspected;
import com.amazonaws.services.lambda.runtime.events.S3Event;

/**
  Request: representa un evento de S3
 */
@Introspected
public class Request extends S3Event{
}
