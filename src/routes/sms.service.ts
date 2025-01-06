import { SMSStatus } from '@Utility/enums';
import axios from 'axios';
import { Constants } from '@Utility/constants';
import OtpService from '@ServiceHelpers/otp.service.helper';
import { SMSLog } from '@Models/sms-logs.model';
import { v4 as uuidv4 } from 'uuid';

export default class SmsService {
	/**
	 * Function to send SMS via AWS SNS
	 * @param {string} mobile - The phone number to send SMS to
	 * @param {string} message - The message to be sent
	 * @returns {Promise<void>}
	 */
	public static async sendSms(mobile: string, message: string): Promise<any> {
		if (!mobile || !message) {
			throw new Error('sendTo and message are required.');
		}
		console.log('log:::', Constants.smsGateway);

		const smsTemplateId: string = Constants.smsGateway.smsTemplateId;
		const subject: string = 'OTP Validation';

		// send sms
		await axios
			.get(Constants.smsGateway.url, {
				params: {
					username: Constants.smsGateway.userName,
					password: Constants.smsGateway.password,
					from: Constants.smsGateway.sender,
					to: mobile,
					msg: message,
					type: Constants.smsGateway.type,
					template_id: smsTemplateId,
				},
			})
			.then(async res => {
				// log sms response
				await SmsService.logSms(mobile, message, subject, SMSStatus.Sent, JSON.stringify(res));
			})
			.catch(async err => {
				// log sms error
				await SmsService.logSms(mobile, message, subject, SMSStatus.Failure, JSON.stringify(err));
			});
	}

	/**
	 * Function to log SMS to the database (or a file)
	 * @param {string} mobile - The phone number to send SMS to
	 * @param {string} message - The message that was sent
	 * @param {string} subject - The subject used for the SMS
	 * @param {SMSStatus} status - The status of the SMS (Sent/Failed)
	 * @param {Object} additionalInfo - The response from AWS SNS
	 */
	public static async logSms(mobile: string, message: string, subject: string, status: string, additionalInfo: string): Promise<any> {
		// Generate a unique ID for the new version
		const id = uuidv4();
		const createdAt = new Date();
		const updatedAt = new Date();

		const newSmsLog = new SMSLog(id, mobile, subject, status, message, additionalInfo, createdAt, updatedAt, false);

		await OtpService.createSmsLog(newSmsLog);
	}
}
