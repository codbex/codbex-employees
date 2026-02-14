import { Entity, Table, Id, Generated, Column, Documentation } from '@aerokit/sdk/db'

@Entity('ContactEntity')
@Table('CODBEX_CONTACT')
@Documentation('Contact entity mapping')
export class ContactEntity {

    @Id()
    @Generated('sequence')
    @Documentation('Id')
    @Column({
        name: 'CONTACT_ID',
        type: 'integer',
    })
    public Id?: number;

    @Documentation('Address')
    @Column({
        name: 'CONTACT_ADDRESS',
        type: 'string',
        length: 200,
        nullable: true,
    })
    public Address!: string;

    @Documentation('Country')
    @Column({
        name: 'CONTACT_COUNTRY',
        type: 'integer',
        nullable: true,
    })
    public Country!: number;

    @Documentation('City')
    @Column({
        name: 'CONTACT_CITY',
        type: 'integer',
        nullable: true,
    })
    public City!: number;

    @Documentation('PostalCode')
    @Column({
        name: 'CONTACT_POSTALCODE',
        type: 'string',
        length: 20,
        nullable: true,
    })
    public PostalCode!: string;

    @Documentation('PhoneNumber')
    @Column({
        name: 'CONTACT_PHONENUMBER',
        type: 'string',
        length: 15,
        nullable: true,
    })
    public PhoneNumber!: string;

    @Documentation('Employee')
    @Column({
        name: 'CONTACT_EMPLOYEE',
        type: 'integer',
        nullable: true,
    })
    public Employee?: number;

}

(new ContactEntity());
