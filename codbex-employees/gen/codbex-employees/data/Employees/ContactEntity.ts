import { Entity, Table, Id, Generated, Column, Documentation, CreatedAt, CreatedBy, UpdatedAt, UpdatedBy} from '@aerokit/sdk/db'

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

    @Documentation('PhoneNumber')
    @Column({
        name: 'CONTACT_PHONENUMBER',
        type: 'string',
        length: 20,
    })
    public PhoneNumber!: string;

    @Documentation('Email')
    @Column({
        name: 'CONTACT_EMAIL',
        type: 'string',
        length: 255,
    })
    public Email!: string;

    @Documentation('Employee')
    @Column({
        name: 'CONTACT_EMPLOYEE',
        type: 'integer',
        nullable: true,
    })
    public Employee?: number;

}

(new ContactEntity());
