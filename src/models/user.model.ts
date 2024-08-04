export class User {
	id: string;
	firstName?: string;
	lastName?: string;
	email?: string;
	mobileNumber?: string;
	gender?: string;
	profilePic?: string;
	userRole?: string;
	accountStatus: string;
	createdBy?: string;
	createdAt: Date;
	updatedBy?: string;
	updatedAt: Date;
	deleted: boolean;

	constructor(
		id: string,
		firstName?: string,
		lastName?: string,
		email?: string,
		mobileNumber?: string,
		gender?: string,
		profilePic?: string,
		userRole?: string,
		accountStatus: string = '1',
		createdBy?: string,
		createdAt?: Date,
		updatedBy?: string,
		updatedAt?: Date,
		deleted: boolean = false,
	) {
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.mobileNumber = mobileNumber;
		this.gender = gender;
		this.profilePic = profilePic;
		this.userRole = userRole;
		this.accountStatus = accountStatus;
		this.createdBy = createdBy;
		this.createdAt = createdAt || new Date();
		this.updatedBy = updatedBy;
		this.updatedAt = updatedAt || new Date();
		this.deleted = deleted;
	}
}
