import { Controller, Get, Post, Put, Delete, Documentation, request, response } from '@aerokit/sdk/http'
import { HttpUtils } from "@aerokit/sdk/http/utils";
import { ValidationError } from '@aerokit/sdk/http/errors'
import { Options } from '@aerokit/sdk/db'
import { Extensions } from "@aerokit/sdk/extensions"
import { Injected, Inject } from '@aerokit/sdk/component'
import { AddressRepository } from '../../data/Employees/AddressRepository'
import { AddressEntity } from '../../data/Employees/AddressEntity'

const validationModules = await Extensions.loadExtensionModules('codbex-employees-Employees-Address', ['validate']);

@Controller
@Documentation('codbex-employees - Address Controller')
@Injected()
class AddressController {

    @Inject('AddressRepository')
    private readonly repository!: AddressRepository;

    @Get('/')
    @Documentation('Get All Address')
    public getAll(_: any, ctx: any): AddressEntity[] {
        try {
            const options: Options = {
                limit: ctx.queryParameters["$limit"] ? parseInt(ctx.queryParameters["$limit"]) : 20,
                offset: ctx.queryParameters["$offset"] ? parseInt(ctx.queryParameters["$offset"]) : 0,
                language: request.getLocale().split("_")[0]
            };

            let Employee = parseInt(ctx.queryParameters.Employee);
            Employee = isNaN(Employee) ? ctx.queryParameters.Employee : Employee;

            if (Employee !== undefined) {
                options.$filter = {
                    equals: {
                        Employee: Employee
                    }
                };
            }

            return this.repository.findAll(options);
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Post('/')
    @Documentation('Create Address')
    public create(entity: AddressEntity): AddressEntity {
        try {
            this.validateEntity(entity);
            entity.Id = this.repository.create(entity) as any;
            response.setHeader('Content-Location', '/services/ts/codbex-employees/gen/codbex-employees/api/Employees/AddressService.ts/' + entity.Id);
            response.setStatus(response.CREATED);
            return entity;
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Get('/count')
    @Documentation('Count Address')
    public count(): { count: number } {
        try {
            return { count: this.repository.count() };
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Post('/count')
    @Documentation('Count Address with filter')
    public countWithFilter(filter: any): { count: number } {
        try {
            return { count: this.repository.count(filter) };
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Post('/search')
    @Documentation('Search Address')
    public search(filter: any): AddressEntity[] {
        try {
            return this.repository.findAll(filter);
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Get('/:id')
    @Documentation('Get Address by id')
    public getById(_: any, ctx: any): AddressEntity {
        try {
            const id = parseInt(ctx.pathParameters.id);
            const options: Options = {
                language: request.getLocale().split("_")[0]
            };
            const entity = this.repository.findById(id, options);
            if (entity) {
                return entity;
            } else {
                HttpUtils.sendResponseNotFound('Address not found');
            }
        } catch (error: any) {
            this.handleError(error);
        }
        return undefined as any;
    }

    @Put('/:id')
    @Documentation('Update Address by id')
    public update(entity: AddressEntity, ctx: any): AddressEntity {
        try {
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
    @Documentation('Delete Address by id')
    public deleteById(_: any, ctx: any): void {
        try {
            const id = parseInt(ctx.pathParameters.id);
            const entity = this.repository.findById(id);
            if (entity) {
                this.repository.deleteById(id);
                HttpUtils.sendResponseNoContent();
            } else {
                HttpUtils.sendResponseNotFound('Address not found');
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

    private validateEntity(entity: any): void {
        if (entity.Country === null || entity.Country === undefined) {
            throw new ValidationError(`The 'Country' property is required, provide a valid value`);
        }
        if (entity.City === null || entity.City === undefined) {
            throw new ValidationError(`The 'City' property is required, provide a valid value`);
        }
        if (entity.Address === null || entity.Address === undefined) {
            throw new ValidationError(`The 'Address' property is required, provide a valid value`);
        }
        if (entity.Address?.length > 255) {
            throw new ValidationError(`The 'Address' exceeds the maximum length of [255] characters`);
        }
        if (entity.PostalCode === null || entity.PostalCode === undefined) {
            throw new ValidationError(`The 'PostalCode' property is required, provide a valid value`);
        }
        if (entity.PostalCode?.length > 12) {
            throw new ValidationError(`The 'PostalCode' exceeds the maximum length of [12] characters`);
        }
        for (const next of validationModules) {
            next.validate(entity);
        }
    }

}
