package gen.codbex_employees.data.employees;

import org.eclipse.dirigible.sdk.db.Column;
import org.eclipse.dirigible.sdk.db.CreatedAt;
import org.eclipse.dirigible.sdk.db.CreatedBy;
import org.eclipse.dirigible.sdk.platform.Documentation;
import org.eclipse.dirigible.sdk.db.Entity;
import org.eclipse.dirigible.sdk.db.GeneratedValue;
import org.eclipse.dirigible.sdk.db.GenerationType;
import org.eclipse.dirigible.sdk.db.Id;
import org.eclipse.dirigible.sdk.db.Table;
import org.eclipse.dirigible.sdk.db.UpdatedAt;
import org.eclipse.dirigible.sdk.db.UpdatedBy;

@Entity
@Table(name = "CODBEX_ADDRESS")
@Documentation("Address entity mapping")
public class AddressEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ADDRESS_ID")
    @Documentation("Id")
    public Integer Id;

    @Column(name = "ADDRESS_COUNTRY", nullable = false)
    @Documentation("Country")
    public Integer Country;

    @Column(name = "ADDRESS_CITY", nullable = false)
    @Documentation("City")
    public Integer City;

    @Column(name = "ADDRESS_ADDRESS", length = 255, nullable = false)
    @Documentation("Address")
    public String Address;

    @Column(name = "ADDRESS_POSTALCODE", length = 12, nullable = false)
    @Documentation("PostalCode")
    public String PostalCode;

    @Column(name = "ADDRESS_EMPLOYEE", nullable = true)
    @Documentation("Employee")
    public Integer Employee;

    @CreatedAt
    @Column(name = "ADDRESS_CREATEDAT", nullable = true)
    @Documentation("CreatedAt")
    public java.time.Instant CreatedAt;

    @CreatedBy
    @Column(name = "ADDRESS_CREATEDBY", length = 20, nullable = true)
    @Documentation("CreatedBy")
    public String CreatedBy;

    @UpdatedAt
    @Column(name = "ADDRESS_UPDATEDAT", nullable = true)
    @Documentation("UpdatedAt")
    public java.time.Instant UpdatedAt;

    @UpdatedBy
    @Column(name = "ADDRESS_UPDATEDBY", length = 20, nullable = true)
    @Documentation("UpdatedBy")
    public String UpdatedBy;

}
