export type UserRole = 'contributor' | 'maintainer';

export type IssueType = 'bug' | 'feature_request';

export type IssueStatus = 'open' | 'in_progress' | 'resolved';

export type JwtUser = {
    id: number;
    name: string;
    role: UserRole;
};

// only 2 types user role in here contributor and maintainer
