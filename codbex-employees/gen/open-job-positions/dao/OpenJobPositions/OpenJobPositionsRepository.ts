import { Query, NamedQueryParameter } from "sdk/db";

export interface OpenJobPositions {
    readonly 'Job Position Number': string;
    readonly 'Organization': string;
    readonly 'Department': string;
    readonly 'Team': string;
    readonly 'Manager': string;
    readonly 'Role': string;
    readonly 'Status': string;
    readonly 'Type': string;
    readonly 'Date opened': Date;
}

export interface OpenJobPositionsFilter {
}

export interface OpenJobPositionsPaginatedFilter extends OpenJobPositionsFilter {
    readonly "$limit"?: number;
    readonly "$offset"?: number;
}

export class OpenJobPositionsRepository {

    private readonly datasourceName?: string;

    constructor(datasourceName?: string) {
        this.datasourceName = datasourceName;
    }

    public findAll(filter: OpenJobPositionsPaginatedFilter): OpenJobPositions[] {
        const sql = `
            SELECT JobPosition.JOBPOSITION_NUMBER as "Job Position Number", Organization.ORGANIZATION_NAME as "Organization", Department.DEPARTMENT_NAME as "Department", Team.TEAM_NAME as "Team", Employee.EMPLOYEE_NAME as "Manager", JobRole.JOBROLE_NAME as "Role", JobStatus.JOBSTATUS_NAME as "Status", JobType.JOBTYPE_NAME as "Type", JobPosition.JOBPOSITION_DATEOPENED as "Date opened"
            FROM CODBEX_JOBPOSITION as JobPosition
              INNER JOIN CODBEX_DEPARTMENT Department ON Department.DEPARTMENT_ID = Team.TEAM_DEPARTMENT
              INNER JOIN CODBEX_ORGANIZATION Organization ON Organization.ORGANIZATION_ID = Team.TEAM_ORGANIZATION
              INNER JOIN CODBEX_JOBROLE JobRole ON JobRole.JOBROLE_ID = JobPosition.JOBPOSITION_ROLE
              INNER JOIN CODBEX_JOBSTATUS JobStatus ON JobStatus.JOBSTATUS_ID = JobPosition.JOBPOSITION_STATUS
              INNER JOIN CODBEX_JOBTYPE JobType ON JobType.JOBTYPE_ID = JobPosition.JOBPOSITION_TYPE
              INNER JOIN CODBEX_TEAM Team ON Team.TEAM_ID = JobPosition.JOBPOSITION_TEAM
              INNER JOIN CODBEX_EMPLOYEE Employee ON Employee.EMPLOYEE_ID=Team.TEAM_MANAGER
            WHERE JobStatus.JOBSTATUS_NAME = 'Open'
            ${Number.isInteger(filter.$limit) ? ` LIMIT ${filter.$limit}` : ''}
            ${Number.isInteger(filter.$offset) ? ` OFFSET ${filter.$offset}` : ''}
        `;

        const parameters: NamedQueryParameter[] = [];

        return Query.executeNamed(sql, parameters, this.datasourceName);
    }

    public count(filter: OpenJobPositionsFilter): number {
        const sql = `
            SELECT COUNT(*) as REPORT_COUNT FROM (
                SELECT JobPosition.JOBPOSITION_NUMBER as "Job Position Number", Organization.ORGANIZATION_NAME as "Organization", Department.DEPARTMENT_NAME as "Department", Team.TEAM_NAME as "Team", Employee.EMPLOYEE_NAME as "Manager", JobRole.JOBROLE_NAME as "Role", JobStatus.JOBSTATUS_NAME as "Status", JobType.JOBTYPE_NAME as "Type", JobPosition.JOBPOSITION_DATEOPENED as "Date opened"
                FROM CODBEX_JOBPOSITION as JobPosition
                  INNER JOIN CODBEX_DEPARTMENT Department ON Department.DEPARTMENT_ID = Team.TEAM_DEPARTMENT
                  INNER JOIN CODBEX_ORGANIZATION Organization ON Organization.ORGANIZATION_ID = Team.TEAM_ORGANIZATION
                  INNER JOIN CODBEX_JOBROLE JobRole ON JobRole.JOBROLE_ID = JobPosition.JOBPOSITION_ROLE
                  INNER JOIN CODBEX_JOBSTATUS JobStatus ON JobStatus.JOBSTATUS_ID = JobPosition.JOBPOSITION_STATUS
                  INNER JOIN CODBEX_JOBTYPE JobType ON JobType.JOBTYPE_ID = JobPosition.JOBPOSITION_TYPE
                  INNER JOIN CODBEX_TEAM Team ON Team.TEAM_ID = JobPosition.JOBPOSITION_TEAM
                  INNER JOIN CODBEX_EMPLOYEE Employee ON Employee.EMPLOYEE_ID=Team.TEAM_MANAGER
                WHERE JobStatus.JOBSTATUS_NAME = 'Open'
            )
        `;

        const parameters: NamedQueryParameter[] = [];

        return Query.executeNamed(sql, parameters, this.datasourceName)[0].REPORT_COUNT;
    }

}