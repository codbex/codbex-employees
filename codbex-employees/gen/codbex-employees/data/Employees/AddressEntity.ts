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
        nullable: true,
    })
    public Country?: number;

    @Documentation('City')
    @Column({
        name: 'ADDRESS_CITY',
        type: 'integer',
        nullable: true,
    })
    public City?: number;

    @Documentation('Address')
    @Column({
        name: 'ADDRESS_ADDRESS',
        type: 'string',
        length: 255,
        nullable: true,
    })
    public Address!: string;

    @Documentation('PostalCode')
    @Column({
        name: 'ADDRESS_POSTALCODE',
        type: 'string',
        length: 12,
        nullable: true,
    })
    public PostalCode!: string;

    @Documentation('Employee')
    @Column({
        name: 'ADDRESS_EMPLOYEE',
        type: 'integer',
        nullable: true,
    })
    public Employee?: number;

}

(new AddressEntity());
