import { Repository, EntityEvent, EntityConstructor, Options } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { MartialStatusEntity } from './MartialStatusEntity'

@Component('MartialStatusRepository')
export class MartialStatusRepository extends Repository<MartialStatusEntity> {

    constructor() {
        super((MartialStatusEntity as EntityConstructor));
    }

    protected override async triggerEvent(data: EntityEvent<MartialStatusEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-employees-Settings-MartialStatus', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-employees-Settings-MartialStatus').send(JSON.stringify(data));
    }
}
