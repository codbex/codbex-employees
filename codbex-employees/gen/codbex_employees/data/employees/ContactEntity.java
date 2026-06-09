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
@Table(name = "CODBEX_CONTACT")
@Documentation("Contact entity mapping")
public class ContactEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CONTACT_ID")
    @Documentation("Id")
    public Integer Id;

    @Column(name = "CONTACT_PHONENUMBER", length = 20, nullable = false)
    @Documentation("PhoneNumber")
    public String PhoneNumber;

    @Column(name = "CONTACT_EMAIL", length = 255, nullable = false, unique = true)
    @Documentation("Email")
    public String Email;

    @Column(name = "CONTACT_EMPLOYEE", nullable = true)
    @Documentation("Employee")
    public Integer Employee;

    @CreatedAt
    @Column(name = "CONTACT_CREATEDAT", nullable = true)
    @Documentation("CreatedAt")
    public java.time.Instant CreatedAt;

    @CreatedBy
    @Column(name = "CONTACT_CREATEDBY", length = 20, nullable = true)
    @Documentation("CreatedBy")
    public String CreatedBy;

    @UpdatedAt
    @Column(name = "CONTACT_UPDATEDAT", nullable = true)
    @Documentation("UpdatedAt")
    public java.time.Instant UpdatedAt;

    @UpdatedBy
    @Column(name = "CONTACT_UPDATEDBY", length = 20, nullable = true)
    @Documentation("UpdatedBy")
    public String UpdatedBy;

}
