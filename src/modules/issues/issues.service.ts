import pool from '../../db';
import { JwtUser } from '../../types';
import { CreateIssueData, UpdateIssueData } from './issues.interface';

const createIssue = async (payload: CreateIssueData, user: JwtUser) => {
    const { title, description, type } = payload;

    if (!title || !description || !type) {
        const error: any = new Error('Title, description and type are required');
        error.statusCode = 400;
        throw error;
    }

    if (title.length > 150) {
        const error: any = new Error('Title cannot be more than 150 characters');
        error.statusCode = 400;
        throw error;
    }

    if (description.length < 20) {
        const error: any = new Error('Description must be at least 20 characters');
        error.statusCode = 400;
        throw error;
    }

    if (type !== 'bug' && type !== 'feature_request') {
        const error: any = new Error('Type must be bug or feature_request');
        error.statusCode = 400;
        throw error;
    }

    const result = await pool.query(
        `
    INSERT INTO issues (title, description, type, reporter_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
        [title, description, type, user.id]
    );

    return result.rows[0];
};

const getAllIssues = async (query: any) => {
    const sort = query.sort || 'newest';
    const type = query.type;
    const status = query.status;

    if (sort !== 'newest' && sort !== 'oldest') {
        const error: any = new Error('Sort must be newest or oldest');
        error.statusCode = 400;
        throw error;
    }

    if (type && type !== 'bug' && type !== 'feature_request') {
        const error: any = new Error('Type must be bug or feature_request');
        error.statusCode = 400;
        throw error;
    }

    if (status && status !== 'open' && status !== 'in_progress' && status !== 'resolved') {
        const error: any = new Error('Status must be open, in_progress or resolved');
        error.statusCode = 400;
        throw error;
    }

    let result;

    if (type && status) {
        result = await pool.query(
            `
      SELECT * FROM issues
      WHERE type = $1 AND status = $2
      ORDER BY created_at ${sort === 'oldest' ? 'ASC' : 'DESC'}
      `,
            [type, status]
        );
    } else if (type) {
        result = await pool.query(
            `
      SELECT * FROM issues
      WHERE type = $1
      ORDER BY created_at ${sort === 'oldest' ? 'ASC' : 'DESC'}
      `,
            [type]
        );
    } else if (status) {
        result = await pool.query(
            `
      SELECT * FROM issues
      WHERE status = $1
      ORDER BY created_at ${sort === 'oldest' ? 'ASC' : 'DESC'}
      `,
            [status]
        );
    } else {
        result = await pool.query(
            `
      SELECT * FROM issues
      ORDER BY created_at ${sort === 'oldest' ? 'ASC' : 'DESC'}
      `
        );
    }

    const issues = result.rows;
    const finalIssues = [];

    for (const issue of issues) {
        const userResult = await pool.query(
            'SELECT id, name, role FROM users WHERE id = $1',
            [issue.reporter_id]
        );

        finalIssues.push({
            id: issue.id,
            title: issue.title,
            description: issue.description,
            type: issue.type,
            status: issue.status,
            reporter: userResult.rows[0] || null,
            created_at: issue.created_at,
            updated_at: issue.updated_at,
        });
    }

    return finalIssues;
};

const getSingleIssue = async (id: number) => {
    const issueResult = await pool.query(
        'SELECT * FROM issues WHERE id = $1',
        [id]
    );

    if (issueResult.rows.length === 0) {
        const error: any = new Error('Issue not found');
        error.statusCode = 404;
        throw error;
    }

    const issue = issueResult.rows[0];

    const userResult = await pool.query(
        'SELECT id, name, role FROM users WHERE id = $1',
        [issue.reporter_id]
    );

    return {
        id: issue.id,
        title: issue.title,
        description: issue.description,
        type: issue.type,
        status: issue.status,
        reporter: userResult.rows[0] || null,
        created_at: issue.created_at,
        updated_at: issue.updated_at,
    };
};

const updateIssue = async (
    id: number,
    payload: UpdateIssueData,
    user: JwtUser
) => {
    const issueResult = await pool.query(
        'SELECT * FROM issues WHERE id = $1',
        [id]
    );

    if (issueResult.rows.length === 0) {
        const error: any = new Error('Issue not found');
        error.statusCode = 404;
        throw error;
    }

    const issue = issueResult.rows[0];

    const isMaintainer = user.role === 'maintainer';
    const isOwner = issue.reporter_id === user.id;

    if (!isMaintainer && !isOwner) {
        const error: any = new Error('You can update only your own issue');
        error.statusCode = 403;
        throw error;
    }

    if (!isMaintainer && issue.status !== 'open') {
        const error: any = new Error('Contributor can update only open issues');
        error.statusCode = 409;
        throw error;
    }

    if (!isMaintainer && payload.status) {
        const error: any = new Error('Contributor cannot update issue status');
        error.statusCode = 403;
        throw error;
    }

    const newTitle = payload.title || issue.title;
    const newDescription = payload.description || issue.description;
    const newType = payload.type || issue.type;
    const newStatus = payload.status || issue.status;

    if (newTitle.length > 150) {
        const error: any = new Error('Title cannot be more than 150 characters');
        error.statusCode = 400;
        throw error;
    }

    if (newDescription.length < 20) {
        const error: any = new Error('Description must be at least 20 characters');
        error.statusCode = 400;
        throw error;
    }

    if (newType !== 'bug' && newType !== 'feature_request') {
        const error: any = new Error('Type must be bug or feature_request');
        error.statusCode = 400;
        throw error;
    }

    if (newStatus !== 'open' && newStatus !== 'in_progress' && newStatus !== 'resolved') {
        const error: any = new Error('Status must be open, in_progress or resolved');
        error.statusCode = 400;
        throw error;
    }

    const result = await pool.query(
        `
    UPDATE issues
    SET title = $1,
        description = $2,
        type = $3,
        status = $4,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $5
    RETURNING *
    `,
        [newTitle, newDescription, newType, newStatus, id]
    );

    return result.rows[0];
};

const deleteIssue = async (id: number, user: JwtUser) => {
    if (user.role !== 'maintainer') {
        const error: any = new Error('Only maintainer can delete issues');
        error.statusCode = 403;
        throw error;
    }

    const issueResult = await pool.query(
        'SELECT id FROM issues WHERE id = $1',
        [id]
    );

    if (issueResult.rows.length === 0) {
        const error: any = new Error('Issue not found');
        error.statusCode = 404;
        throw error;
    }

    await pool.query('DELETE FROM issues WHERE id = $1', [id]);
};

export const IssuesService = {
    createIssue,
    getAllIssues,
    getSingleIssue,
    updateIssue,
    deleteIssue,
};