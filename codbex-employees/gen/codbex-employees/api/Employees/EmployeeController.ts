import { Controller, Get, Post, Put, Delete, Documentation, request, response } from '@aerokit/sdk/http'
import { HttpUtils } from "@aerokit/sdk/http/utils";
import { ValidationError } from '@aerokit/sdk/http/errors'
import { ForbiddenError } from '@aerokit/sdk/http/errors'
import { user } from '@aerokit/sdk/security'
import { Options } from '@aerokit/sdk/db'
import { Extensions } from "@aerokit/sdk/extensions"
import { Injected, Inject } from '@aerokit/sdk/component'
import { EmployeeRepository } from '../../data/Employees/EmployeeRepository'
import { EmployeeEntity } from '../../data/Employees/EmployeeEntity'

const validationModules = await Extensions.loadExtensionModules('codbex-employees-Employees-Employee', ['validate']);

@Controller
@Documentation('codbex-employees - Employee Controller')
@Injected()
class EmployeeController {

    @Inject('EmployeeRepository')
    private readonly repository!: EmployeeRepository;

    @Get('/')
    @Documentation('Get All Employee')
    public getAll(_: any, ctx: any): EmployeeEntity[] {
        try {
            this.checkPermissions('read');
            const options: Options = {
                limit: ctx.queryParameters["$limit"] ? parseInt(ctx.queryParameters["$limit"]) : 20,
                offset: ctx.queryParameters["$offset"] ? parseInt(ctx.queryParameters["$offset"]) : 0,
                language: request.getLocale().split("_")[0]
            };

            return this.repository.findAll(options);
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Post('/')
    @Documentation('Create Employee')
    public create(entity: EmployeeEntity): EmployeeEntity {
        try {
            this.checkPermissions('write');
            this.validateEntity(entity);
            entity.Id = this.repository.create(entity) as any;
            response.setHeader('Content-Location', '/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeController.ts/' + entity.Id);
            response.setStatus(response.CREATED);
            return entity;
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Get('/count')
    @Documentation('Count Employee')
    public count(): { count: number } {
        try {
            this.checkPermissions('read');
            return { count: this.repository.count() };
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Post('/count')
    @Documentation('Count Employee with filter')
    public countWithFilter(filter: any): { count: number } {
        try {
            this.checkPermissions('read');
            return { count: this.repository.count(filter) };
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Post('/search')
    @Documentation('Search Employee')
    public search(filter: any): EmployeeEntity[] {
        try {
            this.checkPermissions('read');
            return this.repository.findAll(filter);
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Get('/:id')
    @Documentation('Get Employee by id')
    public getById(_: any, ctx: any): EmployeeEntity {
        try {
            this.checkPermissions('read');
            const id = parseInt(ctx.pathParameters.id);
            const options: Options = {
                language: request.getLocale().split("_")[0]
            };
            const entity = this.repository.findById(id, options);
            if (entity) {
                return entity;
            } else {
                HttpUtils.sendResponseNotFound('Employee not found');
            }
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Put('/:id')
    @Documentation('Update Employee by id')
    public update(entity: EmployeeEntity, ctx: any): EmployeeEntity {
        try {
            this.checkPermissions('write');
            const id = parseInt(ctx.pathParameters.id);
            entity.Id = id;
            this.validateEntity(entity);
            this.repository.update(entity);
            return entity;
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Delete('/:id')
    @Documentation('Delete Employee by id')
    public deleteById(_: any, ctx: any): void {
        try {
            this.checkPermissions('write');
            const id = parseInt(ctx.pathParameters.id);
            const entity = this.repository.findById(id);
            if (entity) {
                this.repository.deleteById(id);
                HttpUtils.sendResponseNoContent();
            } else {
                HttpUtils.sendResponseNotFound('Employee not found');
            }
        } catch (error: any) {
            this.handleError(error);
        }
    }

    private handleError(error: any) {
        if (error.name === 'ForbiddenError') {
            HttpUtils.sendForbiddenRequest(error.message);
        } else if (error.name === 'ValidationError') {
            HttpUtils.sendResponseBadRequest(error.message);
        } else {
            HttpUtils.sendInternalServerError(error.message);
        }
    }

    private checkPermissions(operationType: string) {
        if (operationType === 'read' && !(user.isInRole('codbex-employees.Employees.EmployeeReadOnly') || user.isInRole('codbex-employees.Employees.EmployeeFullAccess'))) {
            throw new ForbiddenError();
        }
        if (operationType === 'write' && !user.isInRole('codbex-employees.Employees.EmployeeFullAccess')) {
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
        if (entity.PhoneNumber === null || entity.PhoneNumber === undefined) {
            throw new ValidationError(`The 'PhoneNumber' property is required, provide a valid value`);
        }
        if (entity.PhoneNumber?.length > 20) {
            throw new ValidationError(`The 'PhoneNumber' exceeds the maximum length of [20] characters`);
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
        if (entity.Nationality === null || entity.Nationality === undefined) {
            throw new ValidationError(`The 'Nationality' property is required, provide a valid value`);
        }
        if (entity.Gender === null || entity.Gender === undefined) {
            throw new ValidationError(`The 'Gender' property is required, provide a valid value`);
        }
        if (entity.MartialStatus === null || entity.MartialStatus === undefined) {
            throw new ValidationError(`The 'MartialStatus' property is required, provide a valid value`);
        }
        if (entity.IBAN === null || entity.IBAN === undefined) {
            throw new ValidationError(`The 'IBAN' property is required, provide a valid value`);
        }
        if (entity.IBAN?.length > 34) {
            throw new ValidationError(`The 'IBAN' exceeds the maximum length of [34] characters`);
        }
        if (!RegExp(/^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/).test(entity.IBAN)) {
            throw new ValidationError(`The value provided for the 'IBAN' property ('[${entity.IBAN}]') doesn't match the required pattern '^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$'`);
        }
        for (const next of validationModules) {
            next.validate(entity);
        }
    }

}
