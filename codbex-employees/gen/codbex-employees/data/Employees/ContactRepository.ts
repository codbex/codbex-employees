import { Repository, EntityEvent, EntityConstructor, Options } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { ContactEntity } from './ContactEntity'

@Component('ContactRepository')
export class ContactRepository extends Repository<ContactEntity> {

    constructor() {
        super((ContactEntity as EntityConstructor));
    }

    public override findById(id: string | number, options?: Options): ContactEntity | undefined {
        const entity = super.findById(id, options);
        if (entity) {
            entity.CreatedAt = entity.CreatedAt ? new Date(entity.CreatedAt) : undefined;
            entity.UpdatedAt = entity.UpdatedAt ? new Date(entity.UpdatedAt) : undefined;
        }
        return entity;
    }

    public override findAll(options?: Options): ContactEntity[] {
        const entities = super.findAll(options);
        entities.forEach(entity => {
            entity.CreatedAt = entity.CreatedAt ? new Date(entity.CreatedAt) : undefined;
            entity.UpdatedAt = entity.UpdatedAt ? new Date(entity.UpdatedAt) : undefined;
        });
        return entities;
    }

    protected override async triggerEvent(data: EntityEvent<ContactEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-employees-Employees-Contact', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-employees-Employees-Contact').send(JSON.stringify(data));
    }
}
