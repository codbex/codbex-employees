import { Repository, EntityEvent, EntityConstructor, Options } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { GenderEntity } from './GenderEntity'

@Component('GenderRepository')
export class GenderRepository extends Repository<GenderEntity> {

    constructor() {
        super((GenderEntity as EntityConstructor));
    }

    protected override async triggerEvent(data: EntityEvent<GenderEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-employees-Settings-Gender', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-employees-Settings-Gender').send(JSON.stringify(data));
    }
}
