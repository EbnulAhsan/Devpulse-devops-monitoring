import { Response } from 'express';

type TResponse = {
    statusCode: number;
    success: boolean;
    message: string;
    data?: any;
};

const sendResponse = (res: Response, data: TResponse) => {
    res.status(data.statusCode).json({
        success: data.success,
        message: data.message,
        data: data.data,
    });
};

export default sendResponse;