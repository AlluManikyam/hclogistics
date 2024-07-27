// import Logger from '@Middlewares/logger.middleware';
import { SystemHelper } from '@Utility/system-helper';
import { Request, Response } from 'express';

export default class UserController {
	constructor() {}

	public static async checkTenant(req: Request, res: Response) {
		try {
			const x = Math.random();
			if (x != 10) {
				return SystemHelper.sendResponse(req, res, 200, { response: 'responsedata' });
			}
		} catch (err) {
			return SystemHelper.throwError(req, res, 404, 'Error Mesage', 'INVALID_USER', { errorMeta: 'asd' });
		}
		// business logic
		return SystemHelper.sendResponse(req, res, 200, { response: 'responsedata' });
	}
}
