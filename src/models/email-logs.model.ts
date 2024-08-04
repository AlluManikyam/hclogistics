export class EmailLog {
	id: string;
	emailTo: string;
	emailSubject: string;
	emailBody: string;
	additionalInfo: string;
	createdBy?: string;
	createdAt: Date;
	updatedBy?: string;
	updatedAt: Date;
	deleted: boolean;

	constructor(
		id: string,
		emailTo: string,
		emailSubject: string,
		emailBody: string,
		additionalInfo: string,
		createdBy?: string,
		createdAt?: Date,
		updatedBy?: string,
		updatedAt?: Date,
		deleted: boolean = false,
	) {
		this.id = id;
		this.emailTo = emailTo;
		this.emailSubject = emailSubject;
		this.emailBody = emailBody;
		this.additionalInfo = additionalInfo;
		this.createdBy = createdBy;
		this.createdAt = createdAt || new Date();
		this.updatedBy = updatedBy;
		this.updatedAt = updatedAt || new Date();
		this.deleted = deleted;
	}
}
