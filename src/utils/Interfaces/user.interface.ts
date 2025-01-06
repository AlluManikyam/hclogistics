export interface ITenant {
	_id: string;
	name: string;
	description: string;
	image: string;
}

export interface SMSGatewayResponseData {
	Id: string;
	Ack: string;
	mobileNo: string;
}
