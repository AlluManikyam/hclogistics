import { Constants } from '@Utility/constants';
import { SystemHelper } from '@Utility/system-helper';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

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

export const validateJWT = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers['authorization'];

	if (!authHeader) {
		// Return early if no authorization header is provided
		return res.status(401).json({ message: 'Access token missing' });
	}

	const token = authHeader.split(' ')[1]; // Assuming 'Bearer <token>'

	if (!token) {
		// Return early if the token is not in the correct format
		return res.status(401).json({ message: 'Malformed token' });
	}

	jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded: any) => {
		if (err) {
			// Return early if verification fails
			return res.status(403).json({ message: 'Invalid token' });
		}

		// Save decoded user info to the request object
		req.user = decoded;

		// Proceed to the next middleware
		next();
		return;
	});
	return;
};

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
