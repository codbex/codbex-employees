package gen.codbex_employees.data.settings;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;
import org.eclipse.dirigible.sdk.messaging.Producer;
import org.eclipse.dirigible.sdk.utils.Json;

@Repository
public class GenderRepository extends JavaRepository<GenderEntity> {

    public GenderRepository() {
        super(GenderEntity.class);
    }

    @Override
    public GenderEntity save(GenderEntity entity) {
        GenderEntity saved = super.save(entity);
        // Publish the create event so listeners (e.g. intent process triggers / reactions under gen/events) can react.
        Producer.sendToTopic("codbex-employees-Settings-Gender", Json.stringify(saved));
        return saved;
    }

    @Override
    public GenderEntity update(GenderEntity entity) {
        GenderEntity updated = super.update(entity);
        // Publish the update event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-employees-Settings-Gender-updated", Json.stringify(updated));
        return updated;
    }

    /**
     * Persists changes WITHOUT publishing the "-updated" event. Intended for system-managed
     * back-references — e.g. an intent process trigger writing ProcessId back onto the entity that
     * started it. Going through {@link #update} would re-publish "Gender-updated" and spuriously
     * re-fire onUpdate reactions (notifications, roll-ups, integrations) for a change the user never made.
     */
    public GenderEntity updateWithoutEvent(GenderEntity entity) {
        return super.update(entity);
    }

    @Override
    public void delete(GenderEntity entity) {
        super.delete(entity);
        // Publish the delete event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-employees-Settings-Gender-deleted", Json.stringify(entity));
    }

    @Override
    public void deleteById(Object id) {
        GenderEntity entity = findById(id);
        super.deleteById(id);
        if (entity != null) {
            Producer.sendToTopic("codbex-employees-Settings-Gender-deleted", Json.stringify(entity));
        }
    }
}
