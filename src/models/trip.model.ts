export class Trip {
	id: string;
	slno: string;
	vehicleNo: string;
	status: 'pending' | 'completed'; // Enum type for status
	pickupLocation: string;
	transporterName: string;
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

	constructor(
		id: string,
		slno: string,
		vehicleNo: string,
		status: 'pending' | 'completed',
		pickupLocation: string,
		transporterName: string,
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
	) {
		this.id = id;
		this.slno = slno;
		this.vehicleNo = vehicleNo;
		this.status = status;
		this.pickupLocation = pickupLocation;
		this.transporterName = transporterName;
		this.productType = productType;
		this.productWeight = productWeight;
		this.productBillImage = productBillImage;
		this.pickupProductLocationImage = pickupProductLocationImage;
		this.pickupDate = pickupDate || new Date();
		this.pickBy = pickBy;
		this.dropLocation = dropLocation;
		this.dropProductLocationImage = dropProductLocationImage;
		this.dropDate = dropDate || new Date();
		this.dropBy = dropBy;
		this.createdAt = createdAt || new Date();
		this.updatedAt = updatedAt || new Date();
	}
}
