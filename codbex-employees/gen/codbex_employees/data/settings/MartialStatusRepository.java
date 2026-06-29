package gen.codbex_employees.data.settings;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;

@Repository
public class MartialStatusRepository extends JavaRepository<MartialStatusEntity> {

    public MartialStatusRepository() {
        super(MartialStatusEntity.class);
    }
}
