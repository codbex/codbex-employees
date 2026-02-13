import { Entity, Table, Id, Generated, Column, Documentation } from '@aerokit/sdk/db'

@Entity('MartialStatusEntity')
@Table('CODBEX_MARTIALSTATUS')
@Documentation('MartialStatus entity mapping')
export class MartialStatusEntity {

    @Id()
    @Generated('sequence')
    @Documentation('Id')
    @Column({
        name: 'MARTIALSTATUS_ID',
        type: 'integer',
    })
    public Id?: number;

    @Documentation('Name')
    @Column({
        name: 'MARTIALSTATUS_NAME',
        type: 'string',
        length: 20,
        nullable: true,
    })
    public Name!: string;

}

(new MartialStatusEntity());
