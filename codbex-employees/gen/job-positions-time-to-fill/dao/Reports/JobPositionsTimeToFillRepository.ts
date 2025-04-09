import { Query, NamedQueryParameter } from "sdk/db";

export interface JobPositionsTimeToFill {
    readonly 'Job Position Number': string;
    readonly 'Team': string;
    readonly 'Manager': string;
    readonly 'Role': string;
    readonly 'Status': string;
    readonly 'Date opened': Date;
    readonly 'Date closed': Date;
}

export interface JobPositionsTimeToFillFilter {
}

export interface JobPositionsTimeToFillPaginatedFilter extends JobPositionsTimeToFillFilter {
    readonly "$limit"?: number;
    readonly "$offset"?: number;
}

export class JobPositionsTimeToFillRepository {

    private readonly datasourceName?: string;

    constructor(datasourceName?: string) {
        this.datasourceName = datasourceName;
    }

    public findAll(filter: JobPositionsTimeToFillPaginatedFilter): JobPositionsTimeToFill[] {
        const sql = `
            SELECT JobPosition.JOBPOSITION_NUMBER as "Job Position Number", Team.TEAM_NAME as "Team", Employee.EMPLOYEE_NAME as "Manager", JobRole.JOBROLE_NAME as "Role", JobStatus.JOBSTATUS_NAME as "Status", JobPosition.JOBPOSITION_DATEOPENED as "Date opened", JobPosition.JOBPOSITION_DATECLOSED as "Date closed"
            FROM CODBEX_JOBPOSITION as JobPosition
              INNER JOIN CODBEX_TEAM Team ON Team.TEAM_ID = JobPosition.JOBPOSITION_TEAM
              INNER JOIN CODBEX_EMPLOYEE Employee ON Employee.EMPLOYEE_ID=Team.TEAM_MANAGER
              INNER JOIN CODBEX_JOBROLE JobRole ON JobRole.JOBROLE_ID = JobPosition.JOBPOSITION_ROLE
              INNER JOIN CODBEX_JOBSTATUS JobStatus ON JobStatus.JOBSTATUS_ID = JobPosition.JOBPOSITION_STATUS
            ${Number.isInteger(filter.$limit) ? ` LIMIT ${filter.$limit}` : ''}
            ${Number.isInteger(filter.$offset) ? ` OFFSET ${filter.$offset}` : ''}
        `;

        const parameters: NamedQueryParameter[] = [];

        return Query.executeNamed(sql, parameters, this.datasourceName);
    }

    public count(filter: JobPositionsTimeToFillFilter): number {
        const sql = `
            SELECT COUNT(*) as REPORT_COUNT FROM (
                SELECT JobPosition.JOBPOSITION_NUMBER as "Job Position Number", Team.TEAM_NAME as "Team", Employee.EMPLOYEE_NAME as "Manager", JobRole.JOBROLE_NAME as "Role", JobStatus.JOBSTATUS_NAME as "Status", JobPosition.JOBPOSITION_DATEOPENED as "Date opened", JobPosition.JOBPOSITION_DATECLOSED as "Date closed"
                FROM CODBEX_JOBPOSITION as JobPosition
                  INNER JOIN CODBEX_TEAM Team ON Team.TEAM_ID = JobPosition.JOBPOSITION_TEAM
                  INNER JOIN CODBEX_EMPLOYEE Employee ON Employee.EMPLOYEE_ID=Team.TEAM_MANAGER
                  INNER JOIN CODBEX_JOBROLE JobRole ON JobRole.JOBROLE_ID = JobPosition.JOBPOSITION_ROLE
                  INNER JOIN CODBEX_JOBSTATUS JobStatus ON JobStatus.JOBSTATUS_ID = JobPosition.JOBPOSITION_STATUS
            )
        `;

        const parameters: NamedQueryParameter[] = [];

        return Query.executeNamed(sql, parameters, this.datasourceName)[0].REPORT_COUNT;
    }

}