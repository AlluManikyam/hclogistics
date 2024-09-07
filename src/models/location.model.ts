export class Location {
	id: string;
	name?: string;
	latitude?: string;
	longitude?: string;
	address?: string;
	createdBy?: string;
	createdAt: Date;
	updatedBy?: string;
	updatedAt: Date;
	deleted: boolean;

	constructor(
		id: string,
		name?: string,
		latitude?: string,
		longitude?: string,
		address?: string,
		createdBy?: string,
		createdAt?: Date,
		updatedBy?: string,
		updatedAt?: Date,
		deleted: boolean = false,
	) {
		this.id = id;
		this.name = name;
		this.latitude = latitude;
		this.longitude = longitude;
		this.address = address;
		this.createdBy = createdBy;
		this.createdAt = createdAt || new Date();
		this.updatedBy = updatedBy;
		this.updatedAt = updatedAt || new Date();
		this.deleted = deleted;
	}
}
