import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";
import { EntityUtils } from "../utils/EntityUtils";

export interface AnnualLeaveEntity {
    readonly Id: number;
    Days?: number;
    Year?: Date;
    Employee?: number;
}

export interface AnnualLeaveCreateEntity {
    readonly Days?: number;
    readonly Year?: Date;
    readonly Employee?: number;
}

export interface AnnualLeaveUpdateEntity extends AnnualLeaveCreateEntity {
    readonly Id: number;
}

export interface AnnualLeaveEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Days?: number | number[];
            Year?: Date | Date[];
            Employee?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            Days?: number | number[];
            Year?: Date | Date[];
            Employee?: number | number[];
        };
        contains?: {
            Id?: number;
            Days?: number;
            Year?: Date;
            Employee?: number;
        };
        greaterThan?: {
            Id?: number;
            Days?: number;
            Year?: Date;
            Employee?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Days?: number;
            Year?: Date;
            Employee?: number;
        };
        lessThan?: {
            Id?: number;
            Days?: number;
            Year?: Date;
            Employee?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            Days?: number;
            Year?: Date;
            Employee?: number;
        };
    },
    $select?: (keyof AnnualLeaveEntity)[],
    $sort?: string | (keyof AnnualLeaveEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface AnnualLeaveEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<AnnualLeaveEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface AnnualLeaveUpdateEntityEvent extends AnnualLeaveEntityEvent {
    readonly previousEntity: AnnualLeaveEntity;
}

export class AnnualLeaveRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_ANNUALLEAVE",
        properties: [
            {
                name: "Id",
                column: "ANNUALLEAVE_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Days",
                column: "ANNUALLEAVE_DAYS",
                type: "INTEGER",
            },
            {
                name: "Year",
                column: "ANNUALLEAVE_YEAR",
                type: "DATE",
            },
            {
                name: "Employee",
                column: "ANNUALLEAVE_EMPLOYEE",
                type: "INTEGER",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(AnnualLeaveRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: AnnualLeaveEntityOptions): AnnualLeaveEntity[] {
        return this.dao.list(options).map((e: AnnualLeaveEntity) => {
            EntityUtils.setDate(e, "Year");
            return e;
        });
    }

    public findById(id: number): AnnualLeaveEntity | undefined {
        const entity = this.dao.find(id);
        EntityUtils.setDate(entity, "Year");
        return entity ?? undefined;
    }

    public create(entity: AnnualLeaveCreateEntity): number {
        EntityUtils.setLocalDate(entity, "Year");
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_ANNUALLEAVE",
            entity: entity,
            key: {
                name: "Id",
                column: "ANNUALLEAVE_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: AnnualLeaveUpdateEntity): void {
        // EntityUtils.setLocalDate(entity, "Year");
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_ANNUALLEAVE",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "ANNUALLEAVE_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: AnnualLeaveCreateEntity | AnnualLeaveUpdateEntity): number {
        const id = (entity as AnnualLeaveUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as AnnualLeaveUpdateEntity);
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
            table: "CODBEX_ANNUALLEAVE",
            entity: entity,
            key: {
                name: "Id",
                column: "ANNUALLEAVE_ID",
                value: id
            }
        });
    }

    public count(options?: AnnualLeaveEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_ANNUALLEAVE"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: AnnualLeaveEntityEvent | AnnualLeaveUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-employees-entities-AnnualLeave", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-employees-entities-AnnualLeave").send(JSON.stringify(data));
    }
}
