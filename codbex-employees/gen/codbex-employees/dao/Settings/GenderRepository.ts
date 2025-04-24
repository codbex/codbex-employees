import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface GenderEntity {
    readonly Id: number;
    Name?: string;
}

export interface GenderCreateEntity {
    readonly Name?: string;
}

export interface GenderUpdateEntity extends GenderCreateEntity {
    readonly Id: number;
}

export interface GenderEntityOptions {
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
    $select?: (keyof GenderEntity)[],
    $sort?: string | (keyof GenderEntity)[],
    $order?: 'ASC' | 'DESC',
    $offset?: number,
    $limit?: number,
}

interface GenderEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<GenderEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface GenderUpdateEntityEvent extends GenderEntityEvent {
    readonly previousEntity: GenderEntity;
}

export class GenderRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_GENDER",
        properties: [
            {
                name: "Id",
                column: "GENDER_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "GENDER_NAME",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(GenderRepository.DEFINITION, undefined, dataSource);
    }

    public findAll(options: GenderEntityOptions = {}): GenderEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): GenderEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: GenderCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_GENDER",
            entity: entity,
            key: {
                name: "Id",
                column: "GENDER_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: GenderUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_GENDER",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "GENDER_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: GenderCreateEntity | GenderUpdateEntity): number {
        const id = (entity as GenderUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as GenderUpdateEntity);
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
            table: "CODBEX_GENDER",
            entity: entity,
            key: {
                name: "Id",
                column: "GENDER_ID",
                value: id
            }
        });
    }

    public count(options?: GenderEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_GENDER"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: GenderEntityEvent | GenderUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-employees-Settings-Gender", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-employees-Settings-Gender").send(JSON.stringify(data));
    }
}
