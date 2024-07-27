import { Constants } from '@Utility/constants';
import { SystemHelper } from '@Utility/system-helper';
import { NextFunction, Request, Response } from 'express';
import Validator, { ValidationError } from 'fastest-validator';

export default class Auth {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	requestSchema: any;
	defaultAuthCheck: boolean = true;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	constructor(schema: any) {
		this.requestSchema = schema;
	}

	validate = (req: Request, res: Response, next: NextFunction) => {
		const validationConfig = this.validateRequestParams({ ...req.params, ...req.query, ...req.body });
		if (!validationConfig.isvalid) {
			SystemHelper.throwError(req, res, 402, 'Invalid Params', Constants.ErrorCodes.BAD_REQUEST_PARAMS, { error: validationConfig.error });
			return;
		}
		next();
		return;
	};

	private validateRequestParams(reqParams: object) {
		const returnValue: { isvalid: boolean; error: ValidationError[] } = { isvalid: false, error: [] };
		const validate = new Validator().compile(this.requestSchema);
		const validationResponse = validate(reqParams);

		if (validationResponse == true) {
			returnValue.isvalid = true;
		} else {
			const error = validationResponse;
			returnValue.error = error as ValidationError[];
		}

		return returnValue;
	}
}
