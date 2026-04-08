import { Entity, Table, Id, Generated, Column, Documentation, CreatedAt, CreatedBy, UpdatedAt, UpdatedBy} from '@aerokit/sdk/db'

@Entity('GenderEntity')
@Table('CODBEX_GENDER')
@Documentation('Gender entity mapping')
export class GenderEntity {

    @Id()
    @Generated('sequence')
    @Documentation('Id')
    @Column({
        name: 'GENDER_ID',
        type: 'integer',
    })
    public Id?: number;

    @Documentation('Name')
    @Column({
        name: 'GENDER_NAME',
        type: 'string',
        length: 7,
        nullable: true,
    })
    public Name!: string;

    @Documentation('CreatedAt')
    @Column({
        name: 'GENDER_CREATEDAT',
        type: 'timestamp',
        nullable: true,
    })
    @CreatedAt()
    public CreatedAt?: Date;

    @Documentation('CreatedBy')
    @Column({
        name: 'GENDER_CREATEDBY',
        type: 'string',
        length: 20,
        nullable: true,
    })
    @CreatedBy()
    public CreatedBy?: string;

    @Documentation('UpdatedAt')
    @Column({
        name: 'GENDER_UPDATEDAT',
        type: 'timestamp',
        nullable: true,
    })
    @UpdatedAt()
    public UpdatedAt?: Date;

    @Documentation('UpdatedBy')
    @Column({
        name: 'GENDER_UPDATEDBY',
        type: 'string',
        length: 20,
        nullable: true,
    })
    @UpdatedBy()
    public UpdatedBy?: string;

}

(new GenderEntity());
