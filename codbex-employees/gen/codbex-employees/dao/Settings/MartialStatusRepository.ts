import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface MartialStatusEntity {
    readonly Id: number;
    Name?: string;
}

export interface MartialStatusCreateEntity {
    readonly Name?: string;
}

export interface MartialStatusUpdateEntity extends MartialStatusCreateEntity {
    readonly Id: number;
}

export interface MartialStatusEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Name?: string | string[];
        };
        notEquals?: {
            Id?: number | number[];
            Name?: string | string[];
        };
        contains?: {
            Id?: number;
            Name?: string;
        };
        greaterThan?: {
            Id?: number;
            Name?: string;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Name?: string;
        };
        lessThan?: {
            Id?: number;
            Name?: string;
        };
        lessThanOrEqual?: {
            Id?: number;
            Name?: string;
        };
    },
    $select?: (keyof MartialStatusEntity)[],
    $sort?: string | (keyof MartialStatusEntity)[],
    $order?: 'ASC' | 'DESC',
    $offset?: number,
    $limit?: number,
}

interface MartialStatusEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<MartialStatusEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface MartialStatusUpdateEntityEvent extends MartialStatusEntityEvent {
    readonly previousEntity: MartialStatusEntity;
}

export class MartialStatusRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_MARTIALSTATUS",
        properties: [
            {
                name: "Id",
                column: "MARTIALSTATUS_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "MARTIALSTATUS_NAME",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(MartialStatusRepository.DEFINITION, undefined, dataSource);
    }

    public findAll(options: MartialStatusEntityOptions = {}): MartialStatusEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): MartialStatusEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: MartialStatusCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_MARTIALSTATUS",
            entity: entity,
            key: {
                name: "Id",
                column: "MARTIALSTATUS_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: MartialStatusUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_MARTIALSTATUS",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "MARTIALSTATUS_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: MartialStatusCreateEntity | MartialStatusUpdateEntity): number {
        const id = (entity as MartialStatusUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as MartialStatusUpdateEntity);
            return id;
        } else {
            return this.create(entity);
        }
    }

    public deleteById(id: number): void {
        const entity = this.dao.find(id);
        this.dao.remove(id);
        this.triggerEvent({
            operation: "delete",
            table: "CODBEX_MARTIALSTATUS",
            entity: entity,
            key: {
                name: "Id",
                column: "MARTIALSTATUS_ID",
                value: id
            }
        });
    }

    public count(options?: MartialStatusEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_MARTIALSTATUS"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: MartialStatusEntityEvent | MartialStatusUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-employees-Settings-MartialStatus", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-employees-Settings-MartialStatus").send(JSON.stringify(data));
    }
}
