import { Constants } from '@Utility/constants';
import { SystemHelper } from '@Utility/system-helper';
import { Request, Response } from 'express';

export interface OutGoingResponseType {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: any;
	status: number;
	message: string;
}

export interface ErrorResponseType {
	status: number;
	errorCode: string;
	errorMessage: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	errorData: any;
}

export default class API {
	public static logIncominRequest(req: Request) {
		SystemHelper.broadcastEvent(Constants.Events.LOG_INCOMING_REQUEST, {
			url: req.url,
			timeStamp: SystemHelper.getUtcTime(),
			method: req.method,
			body: req.body,
			params: req.params,
			queryParma: req.query,
		});
	}

	public static logOutGoingResponse(req: Request, res: Response, body: OutGoingResponseType | ErrorResponseType) {
		SystemHelper.broadcastEvent(Constants.Events.LOG_OUTGOING_REQUEST, {
			url: req.url,
			timeStamp: SystemHelper.getUtcTime(),
			method: req.method,
			body: body,
		});
	}
}
