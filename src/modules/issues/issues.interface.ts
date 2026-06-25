import { IssueStatus, IssueType } from '../../types';

export type CreateIssueData = {
    title: string;
    description: string;
    type: IssueType;
};

export type UpdateIssueData = {
    title?: string;
    description?: string;
    type?: IssueType;
    status?: IssueStatus;
};