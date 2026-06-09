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
@Table(name = "CODBEX_EMPLOYEE")
@Documentation("Employee entity mapping")
public class EmployeeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "EMPLOYEE_ID")
    @Documentation("Id")
    public Integer Id;

    @Column(name = "EMPLOYEE_FIRSTNAME", length = 50, nullable = false)
    @Documentation("FirstName")
    public String FirstName;

    @Column(name = "EMPLOYEE_MIDDLENAME", length = 50, nullable = true)
    @Documentation("MiddleName")
    public String MiddleName;

    @Column(name = "EMPLOYEE_LASTNAME", length = 50, nullable = false)
    @Documentation("LastName")
    public String LastName;

    @Column(name = "EMPLOYEE_NAME", length = 70, nullable = true)
    @Documentation("Name")
    public String Name;

    @Column(name = "EMPLOYEE_EMAIL", length = 40, nullable = false, unique = true)
    @Documentation("Email")
    public String Email;

    @Column(name = "EMPLOYEE_PHONENUMBER", length = 20, nullable = false, unique = true)
    @Documentation("PhoneNumber")
    public String PhoneNumber;

    @Column(name = "EMPLOYEE_BIRTHDATE", nullable = false)
    @Documentation("BirthDate")
    public java.time.LocalDate BirthDate;

    @Column(name = "EMPLOYEE_PERSONALNUMBER", length = 10, nullable = false, unique = true)
    @Documentation("PersonalNumber")
    public String PersonalNumber;

    @Column(name = "EMPLOYEE_NATIONALITY", nullable = false)
    @Documentation("Nationality")
    public Integer Nationality;

    @Column(name = "EMPLOYEE_GENDER", nullable = false)
    @Documentation("Gender")
    public Integer Gender;

    @Column(name = "EMPLOYEE_MARTIALSTATUS", nullable = false)
    @Documentation("MartialStatus")
    public Integer MartialStatus;

    @Column(name = "EMPLOYEE_IBAN", length = 34, nullable = false, unique = true)
    @Documentation("IBAN")
    public String IBAN;

    @CreatedAt
    @Column(name = "EMPLOYEE_CREATEDAT", nullable = true)
    @Documentation("CreatedAt")
    public java.time.Instant CreatedAt;

    @CreatedBy
    @Column(name = "EMPLOYEE_CREATEDBY", length = 20, nullable = true)
    @Documentation("CreatedBy")
    public String CreatedBy;

    @UpdatedAt
    @Column(name = "EMPLOYEE_UPDATEDAT", nullable = true)
    @Documentation("UpdatedAt")
    public java.time.Instant UpdatedAt;

    @UpdatedBy
    @Column(name = "EMPLOYEE_UPDATEDBY", length = 20, nullable = true)
    @Documentation("UpdatedBy")
    public String UpdatedBy;

}
