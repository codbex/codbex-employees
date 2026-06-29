package gen.codbex_employees.data.settings;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;

@Repository
public class GenderRepository extends JavaRepository<GenderEntity> {

    public GenderRepository() {
        super(GenderEntity.class);
    }
}
