import { sql, query } from "@aerokit/sdk/db";
import { producer } from "@aerokit/sdk/messaging";
import { extensions } from "@aerokit/sdk/extensions";
import { dao as daoApi } from "@aerokit/sdk/db";

export interface AddressEntity {
    readonly Id: number;
    Country: number;
    City: number;
    Address: string;
    PostalCode: string;
    Employee?: number;
}

export interface AddressCreateEntity {
    readonly Country: number;
    readonly City: number;
    readonly Address: string;
    readonly PostalCode: string;
    readonly Employee?: number;
}

export interface AddressUpdateEntity extends AddressCreateEntity {
    readonly Id: number;
}

export interface AddressEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Country?: number | number[];
            City?: number | number[];
            Address?: string | string[];
            PostalCode?: string | string[];
            Employee?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            Country?: number | number[];
            City?: number | number[];
            Address?: string | string[];
            PostalCode?: string | string[];
            Employee?: number | number[];
        };
        contains?: {
            Id?: number;
            Country?: number;
            City?: number;
            Address?: string;
            PostalCode?: string;
            Employee?: number;
        };
        greaterThan?: {
            Id?: number;
            Country?: number;
            City?: number;
            Address?: string;
            PostalCode?: string;
            Employee?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Country?: number;
            City?: number;
            Address?: string;
            PostalCode?: string;
            Employee?: number;
        };
        lessThan?: {
            Id?: number;
            Country?: number;
            City?: number;
            Address?: string;
            PostalCode?: string;
            Employee?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            Country?: number;
            City?: number;
            Address?: string;
            PostalCode?: string;
            Employee?: number;
        };
    },
    $select?: (keyof AddressEntity)[],
    $sort?: string | (keyof AddressEntity)[],
    $order?: 'ASC' | 'DESC',
    $offset?: number,
    $limit?: number,
    $language?: string
}

export interface AddressEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<AddressEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export interface AddressUpdateEntityEvent extends AddressEntityEvent {
    readonly previousEntity: AddressEntity;
}

export class AddressRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_ADDRESS",
        properties: [
            {
                name: "Id",
                column: "ADDRESS_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Country",
                column: "ADDRESS_COUNTRY",
                type: "INTEGER",
                required: true
            },
            {
                name: "City",
                column: "ADDRESS_CITY",
                type: "INTEGER",
                required: true
            },
            {
                name: "Address",
                column: "ADDRESS_ADDRESS",
                type: "VARCHAR",
                required: true
            },
            {
                name: "PostalCode",
                column: "ADDRESS_POSTALCODE",
                type: "VARCHAR",
                required: true
            },
            {
                name: "Employee",
                column: "ADDRESS_EMPLOYEE",
                type: "INTEGER",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(AddressRepository.DEFINITION, undefined, dataSource);
    }

    public findAll(options: AddressEntityOptions = {}): AddressEntity[] {
        let list = this.dao.list(options);
        return list;
    }

    public findById(id: number, options: AddressEntityOptions = {}): AddressEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: AddressCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_ADDRESS",
            entity: entity,
            key: {
                name: "Id",
                column: "ADDRESS_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: AddressUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_ADDRESS",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "ADDRESS_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: AddressCreateEntity | AddressUpdateEntity): number {
        const id = (entity as AddressUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as AddressUpdateEntity);
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
            table: "CODBEX_ADDRESS",
            entity: entity,
            key: {
                name: "Id",
                column: "ADDRESS_ID",
                value: id
            }
        });
    }

    public count(options?: AddressEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_ADDRESS"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: AddressEntityEvent | AddressUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-employees-Employees-Address", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-employees-Employees-Address").send(JSON.stringify(data));
    }
}
