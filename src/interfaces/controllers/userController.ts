// controllers/userController.ts
import { Request, Response, NextFunction } from 'express';

import { GetAllUsersUseCase } from '../../application/useCases/getAllUsersUseCase';
import { createCSV, createExcel, createPDF, createHtmlReport } from '../../utils/fileGenerators';
import { Readable } from 'stream';
import { sendResponse } from '../../utils/responseUtils';

const getAllUsersUseCase = new GetAllUsersUseCase();

export const downloadUsers = async (req: Request, res: Response, next: NextFunction) => {
    console.log('downloadUsers requerst',req.query);
    try {
        const users =  await getAllUsersUseCase.execute();
        const format = req.query.format;

        let fileBuffer: Buffer;
        let fileName: string;

        switch (format) {
            case 'pdf':
                fileBuffer = await createPDF(users);
                console.log("🚀 ~ downloadUsers ~ fileBuffer:", fileBuffer)
                
                fileName = 'users.pdf';
                break;
            case 'excel':
                fileBuffer = await createExcel(users);
                fileName = 'users.xlsx';
                break;
            case 'csv':
                fileBuffer = await createCSV(users);
                fileName = 'users.csv';
                break;
            default:
                return res.status(400).send('Invalid format');
        }

        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        res.setHeader('Content-Type', 'application/octet-stream');
        sendResponse(res, {status: 200, message: "File returned successfully", data: fileBuffer, success: true, timestamp: new Date().toISOString()});
    } catch (error) {
        next(error);
    }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await getAllUsersUseCase.execute();
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Transfer-Encoding', 'chunked');
        res.send(JSON.stringify({ status: 200, message: 'Users fetched successfully', data: users }));
        res.end();
    } catch (error) {
        next(error);
    }
}

export const generateHtmlReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await getAllUsersUseCase.execute();
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Transfer-Encoding', 'chunked');
        const htmlStream: Readable = createHtmlReport(users);
        htmlStream.pipe(res);
    } catch (error) {
        next(error);
    }
};