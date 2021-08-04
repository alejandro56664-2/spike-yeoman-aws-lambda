package <%= fullPkg %>;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.lang.ArchRule;
import org.junit.jupiter.api.Test;

import static com.tngtech.archunit.library.Architectures.layeredArchitecture;

class LayeredArchitectureTest {

  @Test
  void layerDependenciesAreRespected() {
    JavaClasses importedClasses = new ClassFileImporter().importPackages("<%= pkgBase %>");

    ArchRule layer_dependencies_are_respected = layeredArchitecture()
        .layer("Controllers").definedBy("<%= pkgBase %>.controller..")
        .layer("Services").definedBy("<%= pkgBase %>.service..")
        .layer("Backend").definedBy("<%= pkgBase %>.backend..")

        .whereLayer("Controllers").mayNotBeAccessedByAnyLayer()
        .whereLayer("Services").mayOnlyBeAccessedByLayers("Controllers")
        .whereLayer("Backend").mayOnlyBeAccessedByLayers("Services");

    layer_dependencies_are_respected.check(importedClasses);

  }
}