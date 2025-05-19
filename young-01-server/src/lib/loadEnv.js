const dotenv = require('dotenv');
const path = require('path');

const env = process.env.NODE_ENV || 'test';
const envFile = `.env.${env}`;
dotenv.config({ path: path.resolve(process.cwd(), envFile) });
