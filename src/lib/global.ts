import * as winston from 'winston';

declare global {
	var log: winston.Logger;
}

export const setLogger = (logger: winston.Logger) => (global.log = logger);
