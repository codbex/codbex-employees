package gen.codbex_employees.data.employees;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;

@Repository
public class ContactRepository extends JavaRepository<ContactEntity> {

    public ContactRepository() {
        super(ContactEntity.class);
    }
}
