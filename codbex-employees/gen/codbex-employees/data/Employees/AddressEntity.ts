import { Entity, Table, Id, Generated, Column, Documentation, CreatedAt, CreatedBy, UpdatedAt, UpdatedBy} from '@aerokit/sdk/db'

@Entity('AddressEntity')
@Table('CODBEX_ADDRESS')
@Documentation('Address entity mapping')
export class AddressEntity {

    @Id()
    @Generated('sequence')
    @Documentation('Id')
    @Column({
        name: 'ADDRESS_ID',
        type: 'integer',
    })
    public Id?: number;

    @Documentation('Country')
    @Column({
        name: 'ADDRESS_COUNTRY',
        type: 'integer',
    })
    public Country!: number;

    @Documentation('City')
    @Column({
        name: 'ADDRESS_CITY',
        type: 'integer',
    })
    public City!: number;

    @Documentation('Address')
    @Column({
        name: 'ADDRESS_ADDRESS',
        type: 'string',
        length: 255,
    })
    public Address!: string;

    @Documentation('PostalCode')
    @Column({
        name: 'ADDRESS_POSTALCODE',
        type: 'string',
        length: 12,
    })
    public PostalCode!: string;

    @Documentation('Employee')
    @Column({
        name: 'ADDRESS_EMPLOYEE',
        type: 'integer',
        nullable: true,
    })
    public Employee?: number;

    @Documentation('CreatedAt')
    @Column({
        name: 'ADDRESS_CREATEDAT',
        type: 'timestamp',
        nullable: true,
    })
    @CreatedAt()
    public CreatedAt?: Date;

    @Documentation('CreatedBy')
    @Column({
        name: 'ADDRESS_CREATEDBY',
        type: 'string',
        length: 20,
        nullable: true,
    })
    @CreatedBy()
    public CreatedBy?: string;

    @Documentation('UpdatedAt')
    @Column({
        name: 'ADDRESS_UPDATEDAT',
        type: 'timestamp',
        nullable: true,
    })
    @UpdatedAt()
    public UpdatedAt?: Date;

    @Documentation('UpdatedBy')
    @Column({
        name: 'ADDRESS_UPDATEDBY',
        type: 'string',
        length: 20,
        nullable: true,
    })
    @UpdatedBy()
    public UpdatedBy?: string;

}

(new AddressEntity());
