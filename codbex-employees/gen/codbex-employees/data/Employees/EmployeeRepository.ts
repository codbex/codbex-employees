import { Repository, EntityEvent, EntityConstructor } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { EmployeeEntity } from './EmployeeEntity'

@Component('EmployeeRepository')
export class EmployeeRepository extends Repository<EmployeeEntity> {

    constructor() {
        super((EmployeeEntity as EntityConstructor));
    }

    public override create(entity: EmployeeEntity): string | number {
        entity.Name = entity["FirstName"] + " " + entity["LastName"];
        return super.create(entity);
    }

    public override upsert(entity: EmployeeEntity): string | number {
        entity.Name = entity["FirstName"] + " " + entity["LastName"];
        entity.Name = entity["FirstName"] + " " + entity["LastName"];
        return super.upsert(entity);
    }

    protected override async triggerEvent(data: EntityEvent<EmployeeEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-employees-Employees-Employee', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-employees-Employees-Employee').send(JSON.stringify(data));
    }
}
