package gen.codbex_employees.api.employees;

import gen.codbex_employees.data.employees.ContactEntity;
import gen.codbex_employees.data.employees.ContactRepository;

import org.eclipse.dirigible.components.api.security.UserFacade;
import org.eclipse.dirigible.sdk.platform.Documentation;
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
@Documentation("codbex-employees - Contact Controller")
public class ContactController {

    private static final Set<String> FILTER_FIELDS = Set.of("Id", "PhoneNumber", "Email", "Employee", "CreatedAt", "CreatedBy", "UpdatedAt", "UpdatedBy");

    private final ContactRepository repository;

    public ContactController(ContactRepository repository) {
        this.repository = repository;
    }

    @Get
    @Documentation("List Contact")
    public List<ContactEntity> getAll(@QueryParam("$limit") Integer limit,
                                      @QueryParam("$offset") Integer offset,
                                      @QueryParam("Employee") String Employee) {
        checkPermissions("read");
        int actualLimit = limit != null ? limit.intValue() : 20;
        int actualOffset = offset != null ? offset.intValue() : 0;
        List<ContactEntity> result;
        if (Employee != null) {
            Map<String, Object> params = new LinkedHashMap<>();
            params.put("Employee", Employee);
            result = repository.query("from ContactEntity e where e.Employee = :Employee", params);
        } else {
            result = repository.findAll(actualLimit, actualOffset);
        }
        return result;
    }

    @Get("/count")
    @Documentation("Count Contact")
    public Map<String, Long> count() {
        checkPermissions("read");
        return Map.of("count", repository.count());
    }

    @Post("/count")
    @Documentation("Count Contact with filter")
    public Map<String, Long> countWithFilter(@Body Map<String, Object> filter) {
        checkPermissions("read");
        return Map.of("count", (long) runFilter(filter).size());
    }

    @Post("/search")
    @Documentation("Search Contact")
    public List<ContactEntity> search(@Body Map<String, Object> filter) {
        checkPermissions("read");
        List<ContactEntity> result = runFilter(filter);
        return result;
    }

    @Get("/{id}")
    @Documentation("Get Contact by id")
    public ContactEntity getById(@PathParam("id") Integer id) {
        checkPermissions("read");
        ContactEntity entity = repository.findOne(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Contact not found"));
        return entity;
    }

    @Post
    @Documentation("Create Contact")
    public ContactEntity create(@Body ContactEntity entity) {
        checkPermissions("write");
        validate(entity);
        return repository.save(entity);
    }

    @Put("/{id}")
    @Documentation("Update Contact by id")
    public ContactEntity update(@PathParam("id") Integer id, @Body ContactEntity entity) {
        checkPermissions("write");
        entity.Id = id;
        validate(entity);
        return repository.update(entity);
    }

    @Delete("/{id}")
    @Documentation("Delete Contact by id")
    public void deleteById(@PathParam("id") Integer id) {
        checkPermissions("write");
        if (repository.findOne(id).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Contact not found");
        }
        repository.deleteById(id);
    }

    private List<ContactEntity> runFilter(Map<String, Object> filter) {
        StringBuilder hql = new StringBuilder("from ContactEntity e");
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
        if ("read".equals(op) && !(UserFacade.isInRole("codbex-employees.Employees.ContactReadOnly") || UserFacade.isInRole("codbex-employees.Employees.ContactFullAccess"))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        if ("write".equals(op) && !UserFacade.isInRole("codbex-employees.Employees.ContactFullAccess")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
    }

    private static void validate(ContactEntity entity) {
        if (entity.PhoneNumber == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'PhoneNumber' property is required");
        }
        if (entity.PhoneNumber != null && entity.PhoneNumber.length() > 20) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'PhoneNumber' exceeds the maximum length of 20");
        }
        if (entity.Email == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'Email' property is required");
        }
        if (entity.Email != null && entity.Email.length() > 255) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'Email' exceeds the maximum length of 255");
        }
        if (entity.CreatedBy != null && entity.CreatedBy.length() > 20) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'CreatedBy' exceeds the maximum length of 20");
        }
        if (entity.UpdatedBy != null && entity.UpdatedBy.length() > 20) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'UpdatedBy' exceeds the maximum length of 20");
        }
    }
}
