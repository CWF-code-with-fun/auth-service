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
        const users =  await getAllUsersUseCase.execute({ offset:0, limit: 1000000 });
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

// export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const offset = parseInt(req.query.offset as string) || 0;
//         const limit = parseInt(req.query.limit as string) || 1000;

//         const users = await getAllUsersUseCase.execute({ offset, limit });
//         res.setHeader('Content-Type', 'application/json');
//         res.setHeader('Transfer-Encoding', 'chunked');
//         res.send(JSON.stringify({ status: 200, message: 'Users fetched successfully', data: users }));
//         res.end();
//     } catch (error) {
//         next(error);
//     }
// }

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const offset = parseInt(req.query.offset as string, 10) || 0;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      const users = await getAllUsersUseCase.execute({ offset, limit });
      sendResponse(res, { status: 200, message: 'Users fetched successfully', data: users });
  
      // // Set headers for streaming response
      // res.setHeader("Content-Type", "application/json");
      // res.setHeader("Transfer-Encoding", "chunked");
  
      // // Create a readable stream
      // const stream = new Readable({
      //   read() {}, // No-op for push-based streaming
      // });
  
      // // Pipe the stream to the response
      // stream.pipe(res);
  
      // // Fetch users and stream the data
      // let currentOffset = offset;
  
      // while (true) {
      //   // Fetch a chunk of users
      //   const users = await getAllUsersUseCase.execute({ offset: currentOffset, limit });
      //   console.log("🚀 ~ getUsers ~ users:", users)
        
      //   if (!users.length) {
      //     // End the stream if no more users
      //     stream.push(null);
      //     break;
      //   }
  
      //   // Stream each user as a JSON chunk
      //   users.forEach((user) => {
      //     stream.push(JSON.stringify(user) + "\n");
      //   });
  
      //   // Increment the offset
      //   currentOffset += users.length;
  
        // Optional: Introduce a small delay for testing (e.g., 500ms between chunks)
        // await new Promise((resolve) => setTimeout(resolve, 500));
      // }
    } catch (error) {
      console.error("Error streaming users:", error);
      res.status(500).json({
        success: false,
        message: "Failed to stream users.",
        error: error,
      });
    }
  };

// export const generateHtmlReport = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const users = await getAllUsersUseCase.executdoe({ offset: 0, limit: 100000 });
//         console.log("🚀 ~ generateHtmlReport ~ users:", users)
//         res.setHeader('Content-Type', 'text/html');
//         res.setHeader('Transfer-Encoding', 'chunked');
//         const htmlStream: Readable = createHtmlReport(users);
//         console.log("🚀 ~ generateHtmlReport ~ htmlStream:", htmlStream)
//         htmlStream.pipe(res);
//     } catch (error) {
//         next(error);
//     }
// };

export const generateHtmlReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Transfer-Encoding', 'chunked');

        const htmlStream = new Readable({
            read() {}
        });

          // Add error handling for the stream
          htmlStream.on('error', (err) => {
            console.error('Stream error:', err);
            next(err);
        });

      // Handle backpressure
      const pushWithBackpressure = (chunk: string): Promise<boolean> => {
        return new Promise((resolve) => {
            const canPush = htmlStream.push(chunk);
            if (canPush) {
                resolve(true);
            } else {
                htmlStream.once('drain', () => resolve(true));
            }
        });
    };
                // Pipe the stream to the response before pushing data
        htmlStream.pipe(res);
   // Pipe stream to response
        htmlStream.pipe(res);

        await pushWithBackpressure('<html><head><title>Users Report</title></head><body>');
        await pushWithBackpressure('<h1>Users List</h1><ul>');



        let offset = 0;
        const limit = 100000; // Reduced chunk size
        
        while (true) {
            const users = await getAllUsersUseCase.execute({ offset, limit });
            if (users.length === 0) break;

            for (const user of users) {
                await pushWithBackpressure(
                    `<li>Name: ${user.name}, Email: ${user.email.getValue()}</li>`
                );
                // Add small delay between chunks
                await new Promise(resolve => setTimeout(resolve, 10));
            }

            offset += limit;
            console.log(`Processed ${offset} users`);
        }

        await pushWithBackpressure('</ul></body></html>');
        htmlStream.push(null);

        console.log("🚀 ~ generateHtmlReport ~ htmlStream:", htmlStream)

    } catch (error) {
        console.error('Error in generateHtmlReport:', error);
        next(error);
    }
};