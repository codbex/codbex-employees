import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface EmployeeAssignmentEntity {
    readonly Id: number;
    JobAssignment?: number;
    Employee?: number;
}

export interface EmployeeAssignmentCreateEntity {
    readonly JobAssignment?: number;
    readonly Employee?: number;
}

export interface EmployeeAssignmentUpdateEntity extends EmployeeAssignmentCreateEntity {
    readonly Id: number;
}

export interface EmployeeAssignmentEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            JobAssignment?: number | number[];
            Employee?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            JobAssignment?: number | number[];
            Employee?: number | number[];
        };
        contains?: {
            Id?: number;
            JobAssignment?: number;
            Employee?: number;
        };
        greaterThan?: {
            Id?: number;
            JobAssignment?: number;
            Employee?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            JobAssignment?: number;
            Employee?: number;
        };
        lessThan?: {
            Id?: number;
            JobAssignment?: number;
            Employee?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            JobAssignment?: number;
            Employee?: number;
        };
    },
    $select?: (keyof EmployeeAssignmentEntity)[],
    $sort?: string | (keyof EmployeeAssignmentEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface EmployeeAssignmentEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<EmployeeAssignmentEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface EmployeeAssignmentUpdateEntityEvent extends EmployeeAssignmentEntityEvent {
    readonly previousEntity: EmployeeAssignmentEntity;
}

export class EmployeeAssignmentRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_EMPLOYEEASSIGNMENT",
        properties: [
            {
                name: "Id",
                column: "EMPLOYEEASSIGNMENT_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "JobAssignment",
                column: "EMPLOYEEASSIGNMENT_JOBASSIGNMENT",
                type: "INTEGER",
            },
            {
                name: "Employee",
                column: "EMPLOYEEASSIGNMENT_EMPLOYEE",
                type: "INTEGER",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(EmployeeAssignmentRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: EmployeeAssignmentEntityOptions): EmployeeAssignmentEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): EmployeeAssignmentEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: EmployeeAssignmentCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_EMPLOYEEASSIGNMENT",
            entity: entity,
            key: {
                name: "Id",
                column: "EMPLOYEEASSIGNMENT_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: EmployeeAssignmentUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_EMPLOYEEASSIGNMENT",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "EMPLOYEEASSIGNMENT_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: EmployeeAssignmentCreateEntity | EmployeeAssignmentUpdateEntity): number {
        const id = (entity as EmployeeAssignmentUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as EmployeeAssignmentUpdateEntity);
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
            table: "CODBEX_EMPLOYEEASSIGNMENT",
            entity: entity,
            key: {
                name: "Id",
                column: "EMPLOYEEASSIGNMENT_ID",
                value: id
            }
        });
    }

    public count(options?: EmployeeAssignmentEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_EMPLOYEEASSIGNMENT"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: EmployeeAssignmentEntityEvent | EmployeeAssignmentUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-employees-Employees-EmployeeAssignment", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-employees-Employees-EmployeeAssignment").send(JSON.stringify(data));
    }
}
