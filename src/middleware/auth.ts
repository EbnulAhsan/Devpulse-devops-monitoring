import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { UserRole, JwtUser } from '../types';

const auth = (...roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization;

        if (!token) {
            const error: any = new Error('Authorization token is required');
            error.statusCode = 401;
            return next(error);
        }

        try {
            const decoded = jwt.verify(token, config.jwt_secret) as JwtUser;

            req.user = decoded;

            if (roles.length > 0 && !roles.includes(decoded.role)) {
                const error: any = new Error('You do not have permission');
                error.statusCode = 403;
                return next(error);
            }

            next();
        } catch (err) {
            const error: any = new Error('Invalid or expired token');
            error.statusCode = 401;
            return next(error);
        }
    };
};

export default auth;