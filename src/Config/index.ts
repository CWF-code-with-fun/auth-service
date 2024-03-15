import { config } from 'dotenv';

config({
    path: '.env',
}); 

const { PORT, NODE_ENV } = process.env;
 
export const Config = {
    PORT,
    NODE_ENV,
}; 
