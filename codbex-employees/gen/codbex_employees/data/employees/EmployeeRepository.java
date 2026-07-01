package gen.codbex_employees.data.employees;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;
import org.eclipse.dirigible.sdk.messaging.Producer;
import org.eclipse.dirigible.sdk.utils.Json;
import org.eclipse.dirigible.sdk.utils.Calc;

@Repository
public class EmployeeRepository extends JavaRepository<EmployeeEntity> {

    public EmployeeRepository() {
        super(EmployeeEntity.class);
    }

    @Override
    public EmployeeEntity save(EmployeeEntity entity) {
        entity.Name = entity.FirstName + " " + entity.LastName;
        EmployeeEntity saved = super.save(entity);
        // Publish the create event so listeners (e.g. intent process triggers / reactions under gen/events) can react.
        Producer.sendToTopic("codbex-employees-Employees-Employee", Json.stringify(saved));
        return saved;
    }

    @Override
    public EmployeeEntity update(EmployeeEntity entity) {
        entity.Name = entity.FirstName + " " + entity.LastName;;
        EmployeeEntity updated = super.update(entity);
        // Publish the update event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-employees-Employees-Employee-updated", Json.stringify(updated));
        return updated;
    }

    /**
     * Persists changes WITHOUT publishing the "-updated" event. Intended for system-managed
     * back-references — e.g. an intent process trigger writing ProcessId back onto the entity that
     * started it. Going through {@link #update} would re-publish "Employee-updated" and spuriously
     * re-fire onUpdate reactions (notifications, roll-ups, integrations) for a change the user never made.
     */
    public EmployeeEntity updateWithoutEvent(EmployeeEntity entity) {
        return super.update(entity);
    }

    @Override
    public void delete(EmployeeEntity entity) {
        super.delete(entity);
        // Publish the delete event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-employees-Employees-Employee-deleted", Json.stringify(entity));
    }

    @Override
    public void deleteById(Object id) {
        EmployeeEntity entity = findById(id);
        super.deleteById(id);
        if (entity != null) {
            Producer.sendToTopic("codbex-employees-Employees-Employee-deleted", Json.stringify(entity));
        }
    }
}
