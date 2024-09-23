import API, { OutGoingResponseType } from '@Middlewares/api.middleware';
import { EventListener } from '@Utility/event-listener';
import { Request, Response } from 'express';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
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

	public static getUUID(): string {
		return uuidv4();
	}

	public static getAwsCreds(): {} {
		return {
			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
			region: 'ap-south-1',
		};
	}

	public static checkUrl(targetString: string): boolean {
		if (!targetString) return true;

		const urlPattern = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/;
		return urlPattern.test(targetString);
	}

	public static checkAndExtractDataURL(dataUrl, contentType = 'image/jpeg') {
		let base64Url = '';

		if (dataUrl.split(',').length <= 1) {
			base64Url = dataUrl.split(',')[0];
			return { base64Url, contentType };
		}

		base64Url = dataUrl.split(',')[1];
		contentType = dataUrl
			.split(',')[0]
			.split(':')[1]
			.split(';')[0];

		return { base64Url, contentType };
	}

	public static isBase64DataUrl = url => {
		// Check if URL starts with 'data:'
		if (!url.startsWith('data:')) {
			return false;
		}

		// Extract the part after 'data:'
		const base64Part = url.split(',')[1];
		if (!base64Part) {
			return false;
		}

		// Base64 pattern to match
		const base64Pattern = /^[A-Za-z0-9+/=]+$/;

		// Check if the string is Base64 encoded
		return base64Pattern.test(base64Part) && base64Part.length % 4 === 0;
	};
}
