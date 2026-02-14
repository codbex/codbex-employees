import { Repository, EntityEvent, EntityConstructor } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { ContactEntity } from './ContactEntity'

@Component('ContactRepository')
export class ContactRepository extends Repository<ContactEntity> {

    constructor() {
        super((ContactEntity as EntityConstructor));
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
