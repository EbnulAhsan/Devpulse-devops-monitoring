import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../utility/sendResponse';
import { IssuesService } from './issues.service';

// create all issues 

const createIssue = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            const error: any = new Error('User is not authenticated');
            error.statusCode = 401;
            throw error;
        }

        const result = await IssuesService.createIssue(req.body, req.user);

        sendResponse(res, {
            statusCode: StatusCodes.CREATED,
            success: true,
            message: 'Issue created successfully',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};


// get all issues function
const getAllIssues = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await IssuesService.getAllIssues(req.query);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Issues retrived successfully',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

// get single issue function

const getSingleIssue = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            const error: any = new Error('Invalid issue id');
            error.statusCode = 400;
            throw error;
        }

        const result = await IssuesService.getSingleIssue(id);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Issue retrived successfully',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

// update function
const updateIssue = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            const error: any = new Error('User is not authenticated');
            error.statusCode = 401;
            throw error;
        }

        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            const error: any = new Error('Invalid issue id');
            error.statusCode = 400;
            throw error;
        }

        const result = await IssuesService.updateIssue(id, req.body, req.user);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Issue updated successfully',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

// delete function

const deleteIssue = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            const error: any = new Error('User is not authenticated');
            error.statusCode = 401;
            throw error;
        }

        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            const error: any = new Error('Invalid issue id');
            error.statusCode = 400;
            throw error;
        }

        await IssuesService.deleteIssue(id, req.user);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Issue deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

export const IssuesController = {
    createIssue,
    getAllIssues,
    getSingleIssue,
    updateIssue,
    deleteIssue,
};
