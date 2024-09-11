import { S3 } from 'aws-sdk';
import { SystemHelper } from '@Utility/system-helper';

// Configure AWS S3
const s3 = new S3({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION,
});

// Function to upload file to S3
export const getS3Url = async (fileData: string, fileName: string | null, bucketName: string) => {
	const { base64Url, contentType } = SystemHelper.checkAndExtractDataURL(fileData);

	// Define file extension based on content type
	let extension = '';
	switch (contentType) {
		case 'image/jpeg':
			extension = '.jpg';
			break;
		case 'image/png':
			extension = '.png';
			break;
		case 'image/gif':
			extension = '.gif';
			break;
		// Add more cases as needed
		default:
			extension = ''; // Handle default case or unknown types
	}

	const uploadObject = {
		Bucket: bucketName,
		Key: (fileName || SystemHelper.getUUID()) + extension,
		Body: Buffer.from(base64Url, 'base64'),
		ContentType: contentType || 'application/octet-stream',
		ACL: 'public-read',
		ContentDisposition: 'inline',
	};

	try {
		const s3response = await s3.upload(uploadObject).promise();
		return s3response.Location;
	} catch (err) {
		console.error(err);
		return '';
	}
};
