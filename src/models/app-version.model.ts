export class AppVersion {
	id: string;
	title?: string;
	description?: string;
	version?: string;
	additionalInfo?: string;
	createdBy?: string;
	createdAt: Date;
	updatedBy?: string;
	updatedAt: Date;
	deleted: boolean;

	constructor(
		id: string,
		title?: string,
		description?: string,
		version?: string,
		additionalInfo?: string,
		createdBy?: string,
		createdAt?: Date,
		updatedBy?: string,
		updatedAt?: Date,
		deleted: boolean = false,
	) {
		this.id = id;
		this.title = title;
		this.description = description;
		this.version = version;
		this.additionalInfo = additionalInfo;
		this.createdBy = createdBy;
		this.createdAt = createdAt || new Date();
		this.updatedBy = updatedBy;
		this.updatedAt = updatedAt || new Date();
		this.deleted = deleted || false;
	}
}
