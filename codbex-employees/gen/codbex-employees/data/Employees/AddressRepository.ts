import { Repository, EntityEvent, EntityConstructor } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { AddressEntity } from './AddressEntity'

@Component('AddressRepository')
export class AddressRepository extends Repository<AddressEntity> {

    constructor() {
        super((AddressEntity as EntityConstructor));
    }

    protected override async triggerEvent(data: EntityEvent<AddressEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-employees-Employees-Address', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-employees-Employees-Address').send(JSON.stringify(data));
    }
}
