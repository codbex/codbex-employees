package gen.codbex_employees.data.employees;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.engine.java.annotations.Repository;

@Repository
public class EmployeeRepository extends JavaRepository<EmployeeEntity> {

    public EmployeeRepository() {
        super(EmployeeEntity.class);
    }

    @Override
    public EmployeeEntity save(EmployeeEntity entity) {
        entity.Name = entity["FirstName"] + " " + entity["LastName"];
        return super.save(entity);
    }

    @Override
    public EmployeeEntity update(EmployeeEntity entity) {
        entity.Name = entity["FirstName"] + " " + entity["LastName"];
        return super.update(entity);
    }
}
