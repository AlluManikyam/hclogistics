import AWS from 'aws-sdk';
import { SystemHelper } from '@Utility/system-helper';
import { SMSType, SMSStatus } from '@Utility/enums';
// const { SMSStatus, SMSType } = require('@ServiceHelpers/enums');
const { SMSLog } = require('@Entities/sms-log'); // Assuming you have a function to save logs

/**
 * Function to send SMS via AWS SNS
 * @param {string} sendTo - The phone number to send SMS to
 * @param {string} message - The message to be sent
 * @returns {Promise<boolean>}
 */
async function sendSms(sendTo: string, message: string): Promise<boolean> {
	try {
		if (!sendTo || !message) {
			throw new Error('sendTo and message are required.');
		}

		const subject = getSmsSubject();
		const params = {
			Message: message,
			PhoneNumber: sendTo,
			MessageAttributes: {
				'AWS.SNS.SMS.SenderID': {
					DataType: 'String',
					StringValue: subject,
				},
				'AWS.SNS.SMS.SMSType': {
					DataType: 'String',
					StringValue: SMSType.Transactional,
				},
			},
		};

		const snsParams = SystemHelper.getAwsCreds();
		const sns = new AWS.SNS({ ...snsParams, apiVersion: '2010-03-31' });

		try {
			const data = await sns.publish(params).promise();
			console.info('Successfully sent', data);
			await logSms(sendTo, message, subject, SMSStatus.Sent, data);
			return true;
		} catch (err) {
			console.error('Error in sending message', err);
			await logSms(sendTo, message, subject, SMSStatus.Failure, err);
			return false;
		}
	} catch (error) {
		console.error('Error in sendSms function', error);
		throw error;
	}
}

/**
 * Function to log SMS to the database (or a file)
 * @param {string} sendTo - The phone number to send SMS to
 * @param {string} message - The message that was sent
 * @param {string} subject - The subject used for the SMS
 * @param {SMSStatus} status - The status of the SMS (Sent/Failed)
 * @param {Object} responseInfo - The response from AWS SNS
 */
async function logSms(sendTo, message, subject, status, responseInfo): Promise<any> {
	// Replace this with your actual logging mechanism (e.g., saving to a file or database)
	const newSmsLog = new SMSLog(); // Create a new instance of your SMS log
	newSmsLog.status = status;
	newSmsLog.responseInfo = responseInfo;
	newSmsLog.message = message;
	newSmsLog.subject = subject;
	newSmsLog.mobile = sendTo;

	// Implement your logging logic here, e.g., saving to a file or a different database
	console.log('Logging SMS:', newSmsLog);
}

/**
 * Helper function to get the SMS subject
 * @returns {string} - The subject of the SMS based on environment
 */
function getSmsSubject() {
	return 'HC-LOGISTICS';
}

// Export the sendSms function
module.exports = { sendSms };
