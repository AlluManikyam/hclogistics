export class Constants {
	public static Events = {
		USER_TEST: 'user.test',
		LOG_INCOMING_REQUEST: 'log.request',
		LOG_OUTGOING_REQUEST: 'log.response',
	};

	public static ErrorCodes = {
		INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
		BAD_REQUEST_PARAMS: 'BAD_REQUEST_PARAMS',
		SERVICE_ERROR: 'SERVICE_ERROR',
	};

	public static Aws = {
		BUCKET: 'hclogistics-data',
	};
}
