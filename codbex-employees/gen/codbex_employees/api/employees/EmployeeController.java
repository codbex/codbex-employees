package gen.codbex_employees.api.employees;

import gen.codbex_employees.data.employees.EmployeeEntity;
import gen.codbex_employees.data.employees.EmployeeRepository;

import org.eclipse.dirigible.components.api.security.UserFacade;
import org.eclipse.dirigible.sdk.platform.Documentation;
import org.eclipse.dirigible.sdk.component.Inject;
import org.eclipse.dirigible.sdk.http.Body;
import org.eclipse.dirigible.sdk.http.Controller;
import org.eclipse.dirigible.sdk.http.Delete;
import org.eclipse.dirigible.sdk.http.Get;
import org.eclipse.dirigible.sdk.http.PathParam;
import org.eclipse.dirigible.sdk.http.Post;
import org.eclipse.dirigible.sdk.http.Put;
import org.eclipse.dirigible.sdk.http.QueryParam;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

@Controller
@Documentation("codbex-employees - Employee Controller")
public class EmployeeController {

    private static final Set<String> FILTER_FIELDS = Set.of("Id", "FirstName", "MiddleName", "LastName", "Name", "Email", "PhoneNumber", "BirthDate", "PersonalNumber", "Nationality", "Gender", "MartialStatus", "IBAN", "CreatedAt", "CreatedBy", "UpdatedAt", "UpdatedBy");

    @Inject
    private EmployeeRepository repository;

    @Get
    @Documentation("List Employee")
    public List<EmployeeEntity> getAll(@QueryParam("$limit") Integer limit,
                                      @QueryParam("$offset") Integer offset) {
        checkPermissions("read");
        int actualLimit = limit != null ? limit.intValue() : 20;
        int actualOffset = offset != null ? offset.intValue() : 0;
        List<EmployeeEntity> result = repository.findAll(actualLimit, actualOffset);
        return result;
    }

    @Get("/count")
    @Documentation("Count Employee")
    public Map<String, Long> count() {
        checkPermissions("read");
        return Map.of("count", repository.count());
    }

    @Post("/count")
    @Documentation("Count Employee with filter")
    public Map<String, Long> countWithFilter(@Body Map<String, Object> filter) {
        checkPermissions("read");
        return Map.of("count", (long) runFilter(filter).size());
    }

    @Post("/search")
    @Documentation("Search Employee")
    public List<EmployeeEntity> search(@Body Map<String, Object> filter) {
        checkPermissions("read");
        List<EmployeeEntity> result = runFilter(filter);
        return result;
    }

    @Get("/{id}")
    @Documentation("Get Employee by id")
    public EmployeeEntity getById(@PathParam("id") Integer id) {
        checkPermissions("read");
        EmployeeEntity entity = repository.findOne(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found"));
        return entity;
    }

    @Post
    @Documentation("Create Employee")
    public EmployeeEntity create(@Body EmployeeEntity entity) {
        checkPermissions("write");
        validate(entity);
        return repository.save(entity);
    }

    @Put("/{id}")
    @Documentation("Update Employee by id")
    public EmployeeEntity update(@PathParam("id") Integer id, @Body EmployeeEntity entity) {
        checkPermissions("write");
        entity.Id = id;
        validate(entity);
        return repository.update(entity);
    }

    @Delete("/{id}")
    @Documentation("Delete Employee by id")
    public void deleteById(@PathParam("id") Integer id) {
        checkPermissions("write");
        if (repository.findOne(id).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found");
        }
        repository.deleteById(id);
    }

    private List<EmployeeEntity> runFilter(Map<String, Object> filter) {
        StringBuilder hql = new StringBuilder("from EmployeeEntity e");
        Map<String, Object> params = new LinkedHashMap<>();
        boolean first = true;
        if (filter != null && filter.get("equals") instanceof Map<?, ?> equals) {
            for (Map.Entry<?, ?> entry : equals.entrySet()) {
                String field = requireKnownField(String.valueOf(entry.getKey()));
                String paramName = "p" + params.size();
                hql.append(first ? " where e." : " and e.").append(field).append(" = :").append(paramName);
                params.put(paramName, entry.getValue());
                first = false;
            }
        }
        if (filter != null && filter.get("conditions") instanceof List<?> conditions) {
            for (Object raw : conditions) {
                if (!(raw instanceof Map<?, ?> condition)) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid filter condition");
                }
                String field = requireKnownField(String.valueOf(condition.get("propertyName")));
                String operator = String.valueOf(condition.get("operator")).toUpperCase(Locale.ROOT);
                Object value = condition.get("value");
                String paramName = "p" + params.size();
                String clause = switch (operator) {
                    case "EQ" -> "e." + field + " = :" + paramName;
                    case "IN" -> {
                        if (!(value instanceof Collection<?>)) {
                            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "IN value must be a list for field: " + field);
                        }
                        yield "e." + field + " in (:" + paramName + ")";
                    }
                    case "LIKE" -> "e." + field + " like :" + paramName;
                    default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported operator: " + operator);
                };
                hql.append(first ? " where " : " and ").append(clause);
                params.put(paramName, value);
                first = false;
            }
        }
        return repository.query(hql.toString(), params);
    }

    private static String requireKnownField(String field) {
        if (!FILTER_FIELDS.contains(field)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown filter field: " + field);
        }
        return field;
    }

    private void checkPermissions(String op) {
        if ("read".equals(op) && !(UserFacade.isInRole("codbex-employees.Employees.EmployeeReadOnly") || UserFacade.isInRole("codbex-employees.Employees.EmployeeFullAccess"))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        if ("write".equals(op) && !UserFacade.isInRole("codbex-employees.Employees.EmployeeFullAccess")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
    }

    private static void validate(EmployeeEntity entity) {
        if (entity.FirstName == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'FirstName' property is required");
        }
        if (entity.FirstName != null && entity.FirstName.length() > 50) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'FirstName' exceeds the maximum length of 50");
        }
        if (entity.MiddleName != null && entity.MiddleName.length() > 50) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'MiddleName' exceeds the maximum length of 50");
        }
        if (entity.LastName == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'LastName' property is required");
        }
        if (entity.LastName != null && entity.LastName.length() > 50) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'LastName' exceeds the maximum length of 50");
        }
        if (entity.Name != null && entity.Name.length() > 70) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'Name' exceeds the maximum length of 70");
        }
        if (entity.Email == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'Email' property is required");
        }
        if (entity.Email != null && entity.Email.length() > 40) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'Email' exceeds the maximum length of 40");
        }
        if (entity.PhoneNumber == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'PhoneNumber' property is required");
        }
        if (entity.PhoneNumber != null && entity.PhoneNumber.length() > 20) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'PhoneNumber' exceeds the maximum length of 20");
        }
        if (entity.BirthDate == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'BirthDate' property is required");
        }
        if (entity.PersonalNumber == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'PersonalNumber' property is required");
        }
        if (entity.PersonalNumber != null && entity.PersonalNumber.length() > 10) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'PersonalNumber' exceeds the maximum length of 10");
        }
        if (entity.Nationality == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'Nationality' property is required");
        }
        if (entity.Gender == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'Gender' property is required");
        }
        if (entity.MartialStatus == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'MartialStatus' property is required");
        }
        if (entity.IBAN == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'IBAN' property is required");
        }
        if (entity.IBAN != null && entity.IBAN.length() > 34) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'IBAN' exceeds the maximum length of 34");
        }
        if (entity.IBAN != null && !entity.IBAN.toString().matches("^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The value of 'IBAN' does not match the required pattern '^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$'");
        }
        if (entity.CreatedBy != null && entity.CreatedBy.length() > 20) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'CreatedBy' exceeds the maximum length of 20");
        }
        if (entity.UpdatedBy != null && entity.UpdatedBy.length() > 20) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'UpdatedBy' exceeds the maximum length of 20");
        }
    }
}
