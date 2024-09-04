import { Controller, Get, Post, Put, Delete, response } from "sdk/http"
import { Extensions } from "sdk/extensions"
import { ContactRepository, ContactEntityOptions } from "../../dao/entities/ContactRepository";
import { ValidationError } from "../utils/ValidationError";
import { HttpUtils } from "../utils/HttpUtils";

const validationModules = await Extensions.loadExtensionModules("codbex-employees-entities-Contact", ["validate"]);

@Controller
class ContactService {

    private readonly repository = new ContactRepository();

    @Get("/")
    public getAll(_: any, ctx: any) {
        try {
            const options: ContactEntityOptions = {
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
            this.validateEntity(entity);
            entity.Id = this.repository.create(entity);
            response.setHeader("Content-Location", "/services/ts/codbex-employees/gen/codbex-employees/api/entities/ContactService.ts/" + entity.Id);
            response.setStatus(response.CREATED);
            return entity;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Get("/count")
    public count() {
        try {
            return this.repository.count();
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Post("/count")
    public countWithFilter(filter: any) {
        try {
            return this.repository.count(filter);
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Post("/search")
    public search(filter: any) {
        try {
            return this.repository.findAll(filter);
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Get("/:id")
    public getById(_: any, ctx: any) {
        try {
            const id = parseInt(ctx.pathParameters.id);
            const entity = this.repository.findById(id);
            if (entity) {
                return entity;
            } else {
                HttpUtils.sendResponseNotFound("Contact not found");
            }
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Put("/:id")
    public update(entity: any, ctx: any) {
        try {
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
            const id = ctx.pathParameters.id;
            const entity = this.repository.findById(id);
            if (entity) {
                this.repository.deleteById(id);
                HttpUtils.sendResponseNoContent();
            } else {
                HttpUtils.sendResponseNotFound("Contact not found");
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

    private validateEntity(entity: any): void {
        if (entity.Address === null || entity.Address === undefined) {
            throw new ValidationError(`The 'Address' property is required, provide a valid value`);
        }
        if (entity.Address?.length > 20) {
            throw new ValidationError(`The 'Address' exceeds the maximum length of [20] characters`);
        }
        if (entity.Country === null || entity.Country === undefined) {
            throw new ValidationError(`The 'Country' property is required, provide a valid value`);
        }
        if (entity.City === null || entity.City === undefined) {
            throw new ValidationError(`The 'City' property is required, provide a valid value`);
        }
        if (entity.PostalCode === null || entity.PostalCode === undefined) {
            throw new ValidationError(`The 'PostalCode' property is required, provide a valid value`);
        }
        if (entity.PostalCode?.length > 20) {
            throw new ValidationError(`The 'PostalCode' exceeds the maximum length of [20] characters`);
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
        if (entity.PhoneNumber?.length > 15) {
            throw new ValidationError(`The 'PhoneNumber' exceeds the maximum length of [15] characters`);
        }
        for (const next of validationModules) {
            next.validate(entity);
        }
    }

}
