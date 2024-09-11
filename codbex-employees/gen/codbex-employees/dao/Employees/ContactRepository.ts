import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface ContactEntity {
    readonly Id: number;
    Address?: string;
    Country?: number;
    City?: number;
    PostalCode?: string;
    Email?: string;
    PhoneNumber?: string;
    Employee?: number;
}

export interface ContactCreateEntity {
    readonly Address?: string;
    readonly Country?: number;
    readonly City?: number;
    readonly PostalCode?: string;
    readonly Email?: string;
    readonly PhoneNumber?: string;
    readonly Employee?: number;
}

export interface ContactUpdateEntity extends ContactCreateEntity {
    readonly Id: number;
}

export interface ContactEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Address?: string | string[];
            Country?: number | number[];
            City?: number | number[];
            PostalCode?: string | string[];
            Email?: string | string[];
            PhoneNumber?: string | string[];
            Employee?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            Address?: string | string[];
            Country?: number | number[];
            City?: number | number[];
            PostalCode?: string | string[];
            Email?: string | string[];
            PhoneNumber?: string | string[];
            Employee?: number | number[];
        };
        contains?: {
            Id?: number;
            Address?: string;
            Country?: number;
            City?: number;
            PostalCode?: string;
            Email?: string;
            PhoneNumber?: string;
            Employee?: number;
        };
        greaterThan?: {
            Id?: number;
            Address?: string;
            Country?: number;
            City?: number;
            PostalCode?: string;
            Email?: string;
            PhoneNumber?: string;
            Employee?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Address?: string;
            Country?: number;
            City?: number;
            PostalCode?: string;
            Email?: string;
            PhoneNumber?: string;
            Employee?: number;
        };
        lessThan?: {
            Id?: number;
            Address?: string;
            Country?: number;
            City?: number;
            PostalCode?: string;
            Email?: string;
            PhoneNumber?: string;
            Employee?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            Address?: string;
            Country?: number;
            City?: number;
            PostalCode?: string;
            Email?: string;
            PhoneNumber?: string;
            Employee?: number;
        };
    },
    $select?: (keyof ContactEntity)[],
    $sort?: string | (keyof ContactEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface ContactEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<ContactEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface ContactUpdateEntityEvent extends ContactEntityEvent {
    readonly previousEntity: ContactEntity;
}

export class ContactRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_CONTACT",
        properties: [
            {
                name: "Id",
                column: "CONTACT_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Address",
                column: "CONTACT_ADDRESS",
                type: "VARCHAR",
            },
            {
                name: "Country",
                column: "CONTACT_COUNTRY",
                type: "INTEGER",
            },
            {
                name: "City",
                column: "CONTACT_CITY",
                type: "INTEGER",
            },
            {
                name: "PostalCode",
                column: "CONTACT_POSTALCODE",
                type: "VARCHAR",
            },
            {
                name: "Email",
                column: "CONTACT_EMAIL",
                type: "VARCHAR",
            },
            {
                name: "PhoneNumber",
                column: "CONTACT_PHONENUMBER",
                type: "VARCHAR",
            },
            {
                name: "Employee",
                column: "CONTACT_EMPLOYEE",
                type: "INTEGER",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(ContactRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: ContactEntityOptions): ContactEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): ContactEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: ContactCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_CONTACT",
            entity: entity,
            key: {
                name: "Id",
                column: "CONTACT_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: ContactUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_CONTACT",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "CONTACT_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: ContactCreateEntity | ContactUpdateEntity): number {
        const id = (entity as ContactUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as ContactUpdateEntity);
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
            table: "CODBEX_CONTACT",
            entity: entity,
            key: {
                name: "Id",
                column: "CONTACT_ID",
                value: id
            }
        });
    }

    public count(options?: ContactEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_CONTACT"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: ContactEntityEvent | ContactUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-employees-Employees-Contact", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-employees-Employees-Contact").send(JSON.stringify(data));
    }
}
