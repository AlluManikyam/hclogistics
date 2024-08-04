export class UserSession {
	id: string;
	userId?: string;
	sessionStatus?: string;
	deviceId?: string;
	createdBy?: string;
	createdAt?: Date;
	updatedBy?: string;
	updatedAt?: Date;
	deleted: boolean;
	jwt?: string;
	deviceToken?: string;
	deviceType?: string;
	expiryDate?: Date;

	constructor(
		id: string,
		userId?: string,
		sessionStatus?: string,
		deviceId?: string,
		createdBy?: string,
		createdAt?: Date,
		updatedBy?: string,
		updatedAt?: Date,
		deleted: boolean = false,
		jwt?: string,
		deviceToken?: string,
		deviceType?: string,
		expiryDate?: Date,
	) {
		this.id = id;
		this.userId = userId;
		this.sessionStatus = sessionStatus;
		this.deviceId = deviceId;
		this.createdBy = createdBy;
		this.createdAt = createdAt || new Date();
		this.updatedBy = updatedBy;
		this.updatedAt = updatedAt || new Date();
		this.deleted = deleted;
		this.jwt = jwt;
		this.deviceToken = deviceToken;
		this.deviceType = deviceType;
		this.expiryDate = expiryDate;
	}
}
