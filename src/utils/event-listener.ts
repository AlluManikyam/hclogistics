import { EventEmitter } from 'events';
import { Constants } from './constants';

export class EventListener {
	public eventEmitter = new EventEmitter();
	constructor() {
		this.eventEmitter.addListener(Constants.Events.LOG_INCOMING_REQUEST, async data => {
			log.info('REQUEST' + JSON.stringify(data));
			// aws x-ray
		});

		this.eventEmitter.addListener(Constants.Events.LOG_OUTGOING_REQUEST, async data => {
			log.info('RESPONSE' + JSON.stringify(data));
		});
	}
}
