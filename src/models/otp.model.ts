export class Otp {
	id: string;
	sendTo: string;
	otp: string;
	status: string;
	sourceType: string;
	requestAttempts: number;
	validateAttempts: number;
	expiryDate?: Date;
	createdBy?: string;
	createdAt: Date;
	updatedBy?: string;
	updatedAt: Date;
	deleted: boolean;

	constructor(
		id: string,
		sendTo: string,
		otp: string,
		status: string,
		sourceType: string,
		requestAttempts: number,
		validateAttempts: number,
		expiryDate?: Date,
		createdBy?: string,
		createdAt?: Date,
		updatedBy?: string,
		updatedAt?: Date,
		deleted: boolean = false,
	) {
		this.id = id;
		this.sendTo = sendTo;
		this.otp = otp;
		this.status = status;
		this.sourceType = sourceType;
		this.requestAttempts = requestAttempts;
		this.validateAttempts = validateAttempts;
		this.expiryDate = expiryDate;
		this.createdBy = createdBy;
		this.createdAt = createdAt || new Date();
		this.updatedBy = updatedBy;
		this.updatedAt = updatedAt || new Date();
		this.deleted = deleted;
	}
}
