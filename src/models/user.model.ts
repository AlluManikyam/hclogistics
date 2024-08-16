export class User {
	id: string;
	name?: string;
	mobileNumber?: string;
	userRole?: string;
	accountStatus: string;
	createdBy?: string;
	createdAt: Date;
	updatedBy?: string;
	updatedAt: Date;
	deleted: boolean;

	constructor(
		id: string,
		name?: string,
		mobileNumber?: string,
		userRole?: string,
		accountStatus: string = 'Active',
		createdBy?: string,
		createdAt?: Date,
		updatedBy?: string,
		updatedAt?: Date,
		deleted: boolean = false,
	) {
		this.id = id;
		this.name = name;
		this.mobileNumber = mobileNumber;
		this.userRole = userRole;
		this.accountStatus = accountStatus;
		this.createdBy = createdBy;
		this.createdAt = createdAt || new Date();
		this.updatedBy = updatedBy;
		this.updatedAt = updatedAt || new Date();
		this.deleted = deleted;
	}
}
