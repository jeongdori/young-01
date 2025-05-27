const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const env = process.env.NODE_ENV || 'test';
const envFile = `.env.${env}`;
dotenv.config({ path: path.resolve(process.cwd(), envFile) });
