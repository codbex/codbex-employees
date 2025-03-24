import { Controller, Get, Post, Put, Delete, response } from "sdk/http"
import { Extensions } from "sdk/extensions"
import { EmployeeRepository, EmployeeEntityOptions } from "../../dao/Employees/EmployeeRepository";
import { user } from "sdk/security"
import { ForbiddenError } from "../utils/ForbiddenError";
import { ValidationError } from "../utils/ValidationError";
import { HttpUtils } from "../utils/HttpUtils";

const validationModules = await Extensions.loadExtensionModules("codbex-employees-Employees-Employee", ["validate"]);

@Controller
class EmployeeService {

    private readonly repository = new EmployeeRepository();

    @Get("/")
    public getAll(_: any, ctx: any) {
        try {
            this.checkPermissions("read");
            const options: EmployeeEntityOptions = {
                $limit: ctx.queryParameters["$limit"] ? parseInt(ctx.queryParameters["$limit"]) : undefined,
                $offset: ctx.queryParameters["$offset"] ? parseInt(ctx.queryParameters["$offset"]) : undefined
            };

            return this.repository.findAll(options);
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Post("/")
    public create(entity: any) {
        try {
            this.checkPermissions("write");
            this.validateEntity(entity);
            entity.Id = this.repository.create(entity);
            response.setHeader("Content-Location", "/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeService.ts/" + entity.Id);
            response.setStatus(response.CREATED);
            return entity;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Get("/count")
    public count() {
        try {
            this.checkPermissions("read");
            return this.repository.count();
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Post("/count")
    public countWithFilter(filter: any) {
        try {
            this.checkPermissions("read");
            return this.repository.count(filter);
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Post("/search")
    public search(filter: any) {
        try {
            this.checkPermissions("read");
            return this.repository.findAll(filter);
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Get("/:id")
    public getById(_: any, ctx: any) {
        try {
            this.checkPermissions("read");
            const id = parseInt(ctx.pathParameters.id);
            const entity = this.repository.findById(id);
            if (entity) {
                return entity;
            } else {
                HttpUtils.sendResponseNotFound("Employee not found");
            }
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Put("/:id")
    public update(entity: any, ctx: any) {
        try {
            this.checkPermissions("write");
            entity.Id = ctx.pathParameters.id;
            this.validateEntity(entity);
            this.repository.update(entity);
            return entity;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Delete("/:id")
    public deleteById(_: any, ctx: any) {
        try {
            this.checkPermissions("write");
            const id = ctx.pathParameters.id;
            const entity = this.repository.findById(id);
            if (entity) {
                this.repository.deleteById(id);
                HttpUtils.sendResponseNoContent();
            } else {
                HttpUtils.sendResponseNotFound("Employee not found");
            }
        } catch (error: any) {
            this.handleError(error);
        }
    }

    private handleError(error: any) {
        if (error.name === "ForbiddenError") {
            HttpUtils.sendForbiddenRequest(error.message);
        } else if (error.name === "ValidationError") {
            HttpUtils.sendResponseBadRequest(error.message);
        } else {
            HttpUtils.sendInternalServerError(error.message);
        }
    }

    private checkPermissions(operationType: string) {
        if (operationType === "read" && !(user.isInRole("codbex-employees.Employees.EmployeeReadOnly") || user.isInRole("codbex-employees.Employees.EmployeeFullAccess"))) {
            throw new ForbiddenError();
        }
        if (operationType === "write" && !user.isInRole("codbex-employees.Employees.EmployeeFullAccess")) {
            throw new ForbiddenError();
        }
    }

    private validateEntity(entity: any): void {
        if (entity.FirstName === null || entity.FirstName === undefined) {
            throw new ValidationError(`The 'FirstName' property is required, provide a valid value`);
        }
        if (entity.FirstName?.length > 50) {
            throw new ValidationError(`The 'FirstName' exceeds the maximum length of [50] characters`);
        }
        if (entity.MiddleName?.length > 50) {
            throw new ValidationError(`The 'MiddleName' exceeds the maximum length of [50] characters`);
        }
        if (entity.LastName === null || entity.LastName === undefined) {
            throw new ValidationError(`The 'LastName' property is required, provide a valid value`);
        }
        if (entity.LastName?.length > 50) {
            throw new ValidationError(`The 'LastName' exceeds the maximum length of [50] characters`);
        }
        if (entity.Name?.length > 70) {
            throw new ValidationError(`The 'Name' exceeds the maximum length of [70] characters`);
        }
        if (entity.Email === null || entity.Email === undefined) {
            throw new ValidationError(`The 'Email' property is required, provide a valid value`);
        }
        if (entity.Email?.length > 40) {
            throw new ValidationError(`The 'Email' exceeds the maximum length of [40] characters`);
        }
        if (entity.BirthDate === null || entity.BirthDate === undefined) {
            throw new ValidationError(`The 'BirthDate' property is required, provide a valid value`);
        }
        if (entity.PersonalNumber === null || entity.PersonalNumber === undefined) {
            throw new ValidationError(`The 'PersonalNumber' property is required, provide a valid value`);
        }
        if (entity.PersonalNumber?.length > 10) {
            throw new ValidationError(`The 'PersonalNumber' exceeds the maximum length of [10] characters`);
        }
        if (entity.Gender === null || entity.Gender === undefined) {
            throw new ValidationError(`The 'Gender' property is required, provide a valid value`);
        }
        if (entity.Nationality === null || entity.Nationality === undefined) {
            throw new ValidationError(`The 'Nationality' property is required, provide a valid value`);
        }
        if (entity.Status === null || entity.Status === undefined) {
            throw new ValidationError(`The 'Status' property is required, provide a valid value`);
        }
        if (entity.IBAN === null || entity.IBAN === undefined) {
            throw new ValidationError(`The 'IBAN' property is required, provide a valid value`);
        }
        if (entity.IBAN?.length > 50) {
            throw new ValidationError(`The 'IBAN' exceeds the maximum length of [50] characters`);
        }
        for (const next of validationModules) {
            next.validate(entity);
        }
    }

}
