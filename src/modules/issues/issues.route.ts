import express from 'express';
import auth from '../../middleware/auth';
import { IssuesController } from './issues.controller';

const router = express.Router();

router.post(
    '/',
    auth('contributor', 'maintainer'),
    IssuesController.createIssue
);

router.get('/', IssuesController.getAllIssues);

router.get('/:id', IssuesController.getSingleIssue);

router.patch(
    '/:id',
    auth('contributor', 'maintainer'),
    IssuesController.updateIssue
);

router.delete(
    '/:id',
    auth('maintainer'),
    IssuesController.deleteIssue
);

export default router;