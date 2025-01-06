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

	public static smsGateway = {
		status: 'true',
		userName: 'Hclogistics',
		password: '465593',
		sender: 'HACHLO',
		type: '1',
		smsTemplateId: '1707173469065266177',
		url: 'https://www.smsstriker.com/API/sms.php',
	};
}
