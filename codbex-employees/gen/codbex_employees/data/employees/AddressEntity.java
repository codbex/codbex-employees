package gen.codbex_employees.data.employees;

import org.eclipse.dirigible.engine.java.annotations.Column;
import org.eclipse.dirigible.engine.java.annotations.CreatedAt;
import org.eclipse.dirigible.engine.java.annotations.CreatedBy;
import org.eclipse.dirigible.engine.java.annotations.Documentation;
import org.eclipse.dirigible.engine.java.annotations.Entity;
import org.eclipse.dirigible.engine.java.annotations.GeneratedValue;
import org.eclipse.dirigible.engine.java.annotations.GenerationType;
import org.eclipse.dirigible.engine.java.annotations.Id;
import org.eclipse.dirigible.engine.java.annotations.Table;
import org.eclipse.dirigible.engine.java.annotations.UpdatedAt;
import org.eclipse.dirigible.engine.java.annotations.UpdatedBy;

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
