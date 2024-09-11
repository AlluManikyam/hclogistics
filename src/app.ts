/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application, NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import roles from '@Routes/role.route';
import location from '@Routes/location.route';
import tenants from '@Routes/tenant.route';
import login from '@Routes/login.route';
import users from '@Routes/user.route';
import otps from '@Routes/otp.route';
import trips from '@Routes/trip.route';
import path from 'path';
import API from '@Middlewares/api.middleware';
import * as global from './lib/global';
import winston from 'winston';
import LoggerConfig from '@Middlewares/logger.middleware';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import { SystemHelper } from '@Utility/system-helper';
import { Messages } from '@Utility/messages';
import { Constants } from '@Utility/constants';

// load configuration from env
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// app configs
const app: Application = express();
const port: number = parseInt(process.env.PORT || '8000');

// headers
app.use((req: Request, res: Response, next: NextFunction) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
	res.header('Access-Control-Allow-Credentials', 'true');
	next();
});

// cors
app.use(cors());

// body-parser
app.use(bodyParser.json({ limit: '150mb' })); // Increase the limit to 150 MB
app.use(bodyParser.urlencoded({ extended: true }));

// set default logger
global.setLogger(winston.createLogger(LoggerConfig));

// set swagger
const swaggerFile: any = `${__dirname}/swagger.json`;
const swaggerData: any = fs.readFileSync(swaggerFile, 'utf8');
const swaggerDocument = JSON.parse(swaggerData);

app.use((req: Request, res: Response, next: NextFunction) => {
	API.logIncominRequest(req);
	next();
});

// server-root
app.get('/', (req: Request, res: Response) => {
	res.send(`<html><body>HMLOGISTICS API SERVICE IS RUNNING</body></html>`);
});

// swagger
app.use('/api/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// load routes
app.use('/api/roles', roles);
app.use('/api/locations', location);
app.use('/api/tenants', tenants);
app.use('/api/auth', login);
app.use('/api/users', users);
app.use('/api/otps', otps);
app.use('/api/trips', trips);

// Invalid routes
app.all('*', (req: Request, res: Response) => {
	SystemHelper.throwError(req, res, 500, Messages.INVALID_API_URL, Constants.ErrorCodes.SERVICE_ERROR, { url: req.url, method: req.method });
});

app.listen(port, () => {
	log.info(`server is running on PORT :: ${port}`);
});
