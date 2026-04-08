import { Entity, Table, Id, Generated, Column, Documentation, CreatedAt, CreatedBy, UpdatedAt, UpdatedBy} from '@aerokit/sdk/db'

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

    @Documentation('CreatedAt')
    @Column({
        name: 'MARTIALSTATUS_CREATEDAT',
        type: 'timestamp',
        nullable: true,
    })
    @CreatedAt()
    public CreatedAt?: Date;

    @Documentation('CreatedBy')
    @Column({
        name: 'MARTIALSTATUS_CREATEDBY',
        type: 'string',
        length: 20,
        nullable: true,
    })
    @CreatedBy()
    public CreatedBy?: string;

    @Documentation('UpdatedAt')
    @Column({
        name: 'MARTIALSTATUS_UPDATEDAT',
        type: 'timestamp',
        nullable: true,
    })
    @UpdatedAt()
    public UpdatedAt?: Date;

    @Documentation('UpdatedBy')
    @Column({
        name: 'MARTIALSTATUS_UPDATEDBY',
        type: 'string',
        length: 20,
        nullable: true,
    })
    @UpdatedBy()
    public UpdatedBy?: string;

}

(new MartialStatusEntity());
