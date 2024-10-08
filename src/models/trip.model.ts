export class Trip {
	id: string;
	slno: string;
	vehicleNo: string;
	status: 'pending' | 'completed'; // Enum type for status
	pickupLocation: string;
	transporterId: string;
	productType: string;
	productWeight: number;
	productBillImage?: string;
	pickupProductLocationImage?: string;
	pickupDate: Date;
	pickBy?: string;
	dropLocation?: string;
	dropProductLocationImage?: string;
	dropDate?: Date;
	dropBy?: string;
	createdAt: Date;
	updatedAt: Date;
	deleted?: boolean;

	constructor(
		id: string,
		slno: string,
		vehicleNo: string,
		status: 'pending' | 'completed',
		pickupLocation: string,
		transporterId: string,
		productType: string,
		productWeight: number,
		productBillImage?: string,
		pickupProductLocationImage?: string,
		pickupDate?: Date,
		pickBy?: string,
		dropLocation?: string,
		dropProductLocationImage?: string,
		dropDate?: Date,
		dropBy?: string,
		createdAt?: Date,
		updatedAt?: Date,
		deleted?: boolean,
	) {
		this.id = id;
		this.slno = slno;
		this.vehicleNo = vehicleNo;
		this.status = status;
		this.pickupLocation = pickupLocation;
		this.transporterId = transporterId;
		this.productType = productType;
		this.productWeight = productWeight;
		this.productBillImage = productBillImage;
		this.pickupProductLocationImage = pickupProductLocationImage;
		this.pickupDate = pickupDate || new Date();
		this.pickBy = pickBy;
		this.dropLocation = dropLocation;
		this.dropProductLocationImage = dropProductLocationImage;
		this.dropDate = dropDate;
		this.dropBy = dropBy;
		this.createdAt = createdAt || new Date();
		this.updatedAt = updatedAt || new Date();
		this.deleted = deleted || false;
	}
}
