package gen.codbex_employees.data.settings;

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
@Table(name = "CODBEX_MARTIALSTATUS")
@Documentation("MartialStatus entity mapping")
public class MartialStatusEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MARTIALSTATUS_ID")
    @Documentation("Id")
    public Integer Id;

    @Column(name = "MARTIALSTATUS_NAME", length = 20, nullable = true)
    @Documentation("Name")
    public String Name;

}
