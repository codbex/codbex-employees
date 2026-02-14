import { Entity, Table, Id, Generated, Column, Documentation } from '@aerokit/sdk/db'

@Entity('EmployeeEntity')
@Table('CODBEX_EMPLOYEE')
@Documentation('Employee entity mapping')
export class EmployeeEntity {

    @Id()
    @Generated('sequence')
    @Documentation('Id')
    @Column({
        name: 'EMPLOYEE_ID',
        type: 'integer',
    })
    public Id?: number;

    @Documentation('FirstName')
    @Column({
        name: 'EMPLOYEE_FIRSTNAME',
        type: 'string',
        length: 50,
    })
    public FirstName!: string;

    @Documentation('MiddleName')
    @Column({
        name: 'EMPLOYEE_MIDDLENAME',
        type: 'string',
        length: 50,
        nullable: true,
    })
    public MiddleName?: string;

    @Documentation('LastName')
    @Column({
        name: 'EMPLOYEE_LASTNAME',
        type: 'string',
        length: 50,
    })
    public LastName!: string;

    @Documentation('Name')
    @Column({
        name: 'EMPLOYEE_NAME',
        type: 'string',
        length: 70,
        nullable: true,
    })
    public Name?: string;

    @Documentation('Email')
    @Column({
        name: 'EMPLOYEE_EMAIL',
        type: 'string',
        length: 40,
        nullable: true,
    })
    public Email!: string;

    @Documentation('BirthDate')
    @Column({
        name: 'EMPLOYEE_BIRTHDATE',
        type: 'date',
        nullable: true,
    })
    public BirthDate!: Date;

    @Documentation('PersonalNumber')
    @Column({
        name: 'EMPLOYEE_PERSONALNUMBER',
        type: 'string',
        length: 10,
        nullable: true,
    })
    public PersonalNumber!: string;

    @Documentation('Gender')
    @Column({
        name: 'EMPLOYEE_GENDER',
        type: 'integer',
        nullable: true,
    })
    public Gender!: number;

    @Documentation('Nationality')
    @Column({
        name: 'EMPLOYEE_NATIONALITY',
        type: 'integer',
        nullable: true,
    })
    public Nationality!: number;

    @Documentation('MartialStatus')
    @Column({
        name: 'EMPLOYEE_MARTIALSTATUS',
        type: 'integer',
        nullable: true,
    })
    public MartialStatus!: number;

    @Documentation('IBAN')
    @Column({
        name: 'EMPLOYEE_IBAN',
        type: 'string',
        length: 50,
        nullable: true,
    })
    public IBAN!: string;

}

(new EmployeeEntity());
