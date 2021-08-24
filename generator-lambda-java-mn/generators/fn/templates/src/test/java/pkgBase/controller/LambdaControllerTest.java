package <%= fullPkg %>;

import <%= pkgBase %>.model.request.Request;
import <%= pkgBase %>.model.response.Response;
import <%= pkgBase %>.service.ILambdaService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class LambdaControllerTest {

  @InjectMocks private static LambdaController lambdaController;

  @Mock static ILambdaService lambdaService;

  @Test
  void executeTest() {
    Response output = lambdaController.execute(Request.builder().build());
    Assertions.assertNull(output);
  }
}
