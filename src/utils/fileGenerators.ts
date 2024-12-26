// utils/fileGenerators.ts
import { User } from '../domain/entities/User';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import { Parser } from 'json2csv';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

export const createPDF = async (users: User[]): Promise<Buffer> => {
    const doc = new PDFDocument();
    const buffers: Buffer[] = [];

    return new Promise<Buffer>((resolve, reject) => {
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfBuffer = Buffer.concat(buffers);

            // Save the generated PDF file
            const filePath = path.join(__dirname, 'users.pdf');
            fs.writeFileSync(filePath, pdfBuffer);

            resolve(pdfBuffer);
        });

        doc.text('Users List');
        users.forEach(user => {
            doc.text(`Name: ${user.name}, Email: ${user.email.getValue()}`);
        });

        doc.end();
    });
};

export const createExcel = async (users: User[]): Promise<Buffer> => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Users');

    worksheet.columns = [
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Email', key: 'email', width: 30 },
    ];

    users.forEach(user => {
        worksheet.addRow({ name: user.name, email: user.email });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
};

export const createCSV = (users: User[]) => {
    const parser = new Parser({ fields: ['name', 'email'] });
    const csv = parser.parse(users);
    return Buffer.from(csv);
};

export const createHtmlReport = (users: User[]): Readable => {
    const htmlStream = new Readable({
        read() {}
    });

    htmlStream.push('<html><head><title>Users Report</title></head><body>');
    htmlStream.push('<h1>Users List</h1>');
    htmlStream.push('<ul>');

    users.forEach(user => {
        htmlStream.push(`<li>Name: ${user.name}, Email: ${user.email.getValue()}</li>`);
    });

    htmlStream.push('</ul>');
    htmlStream.push('</body></html>');
    htmlStream.push(null); // End the stream

    return htmlStream;
};