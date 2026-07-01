package gen.codbex_employees.data.employees;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;
import org.eclipse.dirigible.sdk.messaging.Producer;
import org.eclipse.dirigible.sdk.utils.Json;

@Repository
public class AddressRepository extends JavaRepository<AddressEntity> {

    public AddressRepository() {
        super(AddressEntity.class);
    }

    @Override
    public AddressEntity save(AddressEntity entity) {
        AddressEntity saved = super.save(entity);
        // Publish the create event so listeners (e.g. intent process triggers / reactions under gen/events) can react.
        Producer.sendToTopic("codbex-employees-Employees-Address", Json.stringify(saved));
        return saved;
    }

    @Override
    public AddressEntity update(AddressEntity entity) {
        AddressEntity updated = super.update(entity);
        // Publish the update event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-employees-Employees-Address-updated", Json.stringify(updated));
        return updated;
    }

    /**
     * Persists changes WITHOUT publishing the "-updated" event. Intended for system-managed
     * back-references — e.g. an intent process trigger writing ProcessId back onto the entity that
     * started it. Going through {@link #update} would re-publish "Address-updated" and spuriously
     * re-fire onUpdate reactions (notifications, roll-ups, integrations) for a change the user never made.
     */
    public AddressEntity updateWithoutEvent(AddressEntity entity) {
        return super.update(entity);
    }

    @Override
    public void delete(AddressEntity entity) {
        super.delete(entity);
        // Publish the delete event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-employees-Employees-Address-deleted", Json.stringify(entity));
    }

    @Override
    public void deleteById(Object id) {
        AddressEntity entity = findById(id);
        super.deleteById(id);
        if (entity != null) {
            Producer.sendToTopic("codbex-employees-Employees-Address-deleted", Json.stringify(entity));
        }
    }
}
