import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface OrganisationEntity {
    readonly Id: number;
    Name?: string;
}

export interface OrganisationCreateEntity {
    readonly Name?: string;
}

export interface OrganisationUpdateEntity extends OrganisationCreateEntity {
    readonly Id: number;
}

export interface OrganisationEntityOptions {
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
    $select?: (keyof OrganisationEntity)[],
    $sort?: string | (keyof OrganisationEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface OrganisationEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<OrganisationEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export class OrganisationRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_ORGANISATION",
        properties: [
            {
                name: "Id",
                column: "ORGANISATION_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "ORGANISATION_NAME",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource?: string) {
        this.dao = daoApi.create(OrganisationRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: OrganisationEntityOptions): OrganisationEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): OrganisationEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: OrganisationCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_ORGANISATION",
            entity: entity,
            key: {
                name: "Id",
                column: "ORGANISATION_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: OrganisationUpdateEntity): void {
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_ORGANISATION",
            entity: entity,
            key: {
                name: "Id",
                column: "ORGANISATION_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: OrganisationCreateEntity | OrganisationUpdateEntity): number {
        const id = (entity as OrganisationUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as OrganisationUpdateEntity);
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
            table: "CODBEX_ORGANISATION",
            entity: entity,
            key: {
                name: "Id",
                column: "ORGANISATION_ID",
                value: id
            }
        });
    }

    public count(): number {
        return this.dao.count();
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX__ORGANISATION"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: OrganisationEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-employees/Organisations/Organisation", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.queue("codbex-employees/Organisations/Organisation").send(JSON.stringify(data));
    }
}