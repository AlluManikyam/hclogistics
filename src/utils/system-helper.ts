import API, { OutGoingResponseType } from '@Middlewares/api.middleware';
import { EventListener } from '@Utility/event-listener';
import { Request, Response } from 'express';
import moment from 'moment';

export class SystemHelper {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public static broadcastEvent(eventName: string, payload: any) {
		const newEvent = new EventListener();
		newEvent.eventEmitter.emit(eventName, payload);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public static sendResponse(req: Request, res: Response, status: number, data: any, message: string = '') {
		const resObject: OutGoingResponseType = { status: status, data: data, message: message };
		API.logOutGoingResponse(req, res, resObject);
		return res.status(status).send(resObject);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public static throwError(req: Request, res: Response, status: number, message: string, code: string, data: any = {}) {
		const errorObject = { status: status, errorCode: code, errorMessage: message, errorData: data };
		API.logOutGoingResponse(req, res, errorObject);
		return res.status(status).send(errorObject);
	}

	public static getUtcTime() {
		return moment()
			.utc()
			.format('DD-MM-YYYY HH:mm:ss');
	}
}
