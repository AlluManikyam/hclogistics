import winston from 'winston';
import * as Transport from 'winston-transport';

const appName: string = 'API-SERVICE';

const levels = {
	error: 0,
	warn: 1,
	info: 2,
	http: 3,
	debug: 4,
};

const env = process.env.NODE_ENV || 'DEV';
const isDevelopment = env === 'DEV';

const level = () => {
	return isDevelopment ? 'debug' : 'warn';
};

const colors: winston.config.AbstractConfigSetColors = {
	error: 'red',
	warn: 'yellow',
	info: 'cyan',
	http: 'white',
	debug: 'magenta',
};

winston.addColors(colors);

const format: winston.Logform.Format = winston.format.combine(
	winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
	winston.format.simple(),
	winston.format.printf(info => winston.format.colorize().colorize(info.level, `[${appName}] [${info.timestamp}] [${info.level}]: ${info.message}`)),
);

const transports: Transport[] = [new winston.transports.Console()];

// TODO:add transports based on env

const LoggerConfig: winston.LoggerOptions = {
	level: level(),
	levels,
	format,
	transports,
};

export default LoggerConfig;
