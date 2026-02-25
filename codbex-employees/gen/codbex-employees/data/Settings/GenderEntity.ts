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

}

(new GenderEntity());
