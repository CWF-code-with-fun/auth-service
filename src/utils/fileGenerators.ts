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

const CHUNK_SIZE = 100; // Number of users per chunk

export const createHtmlReport = (users: User[]): Readable => {
    const htmlStream = new Readable({
        read() {}
    });

    // Send header
    htmlStream.push('<!DOCTYPE html><html><head>');
    htmlStream.push('<title>Users Report</title>');
    htmlStream.push('<style>');
    htmlStream.push('.user-row { padding: 10px; border-bottom: 1px solid #eee; }');
    htmlStream.push('</style>');
    htmlStream.push('</head><body>');
    htmlStream.push('<h1>Users List</h1><div id="users-container">');

    // Stream users in chunks
    for (let i = 0; i < users.length; i += CHUNK_SIZE) {
        const chunk = users.slice(i, i + CHUNK_SIZE);
        let chunkHtml = '';
        chunk.forEach(user => {
            chunkHtml += `<div class="user-row">
                <strong>Name:</strong> ${user.name}<br>
                <strong>Email:</strong> ${user.email.getValue()}
            </div>`;
        });
        htmlStream.push(chunkHtml);
    }

    // Send footer
    htmlStream.push('</div></body></html>');
    htmlStream.push(null);

    return htmlStream;
};

export const createStreamingHtmlReport = (): string => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Users Report</title>
            <style>
                .user-row { padding: 10px; border-bottom: 1px solid #eee; }
            </style>
        </head>
        <body>
            <h1>Users List</h1>
            <div id="users-container"></div>
            <script>
                const usersContainer = document.getElementById('users-container');
                let decoder = new TextDecoder();
                let buffer = '';

                const reader = new ReadableStreamDefaultReader(window.stream);
                
                async function processStream() {
                    while (true) {
                        const {value, done} = await reader.read();
                        if (done) break;
                        
                        buffer += decoder.decode(value, {stream: true});
                        
                        if (buffer.includes('\\n')) {
                            const parts = buffer.split('\\n');
                            buffer = parts.pop() || '';
                            
                            for (const part of parts) {
                                if (part.trim()) {
                                    const user = JSON.parse(part);
                                    const userDiv = document.createElement('div');
                                    userDiv.className = 'user-row';
                                    userDiv.innerHTML = \`
                                        <strong>Name:</strong> \${user.name}<br>
                                        <strong>Email:</strong> \${user.email}
                                    \`;
                                    usersContainer.appendChild(userDiv);
                                }
                            }
                        }
                    }
                }
                
                processStream().catch(console.error);
            </script>
        </body>
        </html>
    `;
};