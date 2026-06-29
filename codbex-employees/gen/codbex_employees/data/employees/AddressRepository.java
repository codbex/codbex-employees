package gen.codbex_employees.data.employees;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;

@Repository
public class AddressRepository extends JavaRepository<AddressEntity> {

    public AddressRepository() {
        super(AddressEntity.class);
    }
}
