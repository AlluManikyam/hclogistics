export class SMSLog {
	id: string;
	mobile: string;
	subject: string;
	status: string;
	message: string;
	additionalInfo?: string;
	createdBy?: string;
	createdAt: Date;
	updatedBy?: string;
	updatedAt: Date;
	deleted: boolean;

	constructor(
		id: string,
		mobile: string,
		subject: string,
		status: string,
		message: string,
		additionalInfo?: string,
		createdAt?: Date,
		updatedAt?: Date,
		deleted: boolean = false,
	) {
		this.id = id;
		this.mobile = mobile;
		this.subject = subject;
		this.status = status;
		this.message = message;
		this.additionalInfo = additionalInfo;
		this.createdAt = createdAt || new Date();
		this.updatedAt = updatedAt || new Date();
		this.deleted = deleted;
	}
}
