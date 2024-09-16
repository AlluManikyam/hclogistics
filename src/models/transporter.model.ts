export class Transporter {
	id: string;
	name?: string;
	createdBy?: string;
	createdAt: Date;
	updatedBy?: string;
	updatedAt: Date;
	deleted: boolean;

	constructor(id: string, name?: string, createdBy?: string, createdAt?: Date, updatedBy?: string, updatedAt?: Date, deleted: boolean = false) {
		this.id = id;
		this.name = name;
		this.createdBy = createdBy;
		this.createdAt = createdAt || new Date();
		this.updatedBy = updatedBy;
		this.updatedAt = updatedAt || new Date();
		this.deleted = deleted || false;
	}
}
