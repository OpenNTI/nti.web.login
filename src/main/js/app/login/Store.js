import querystring from 'querystring';

import {Stores} from '@nti/lib-store';
import {getServer, getConfigFor, getService} from '@nti/web-client';//eslint-disable-line

const SettingUp = 'settingup';
const SetupError = 'setuperror';
const Handshake = 'Handshake';
const Busy = 'busy';
const Error = 'error';


export default class LoginStore extends Stores.SimpleStore {
	static SettingUp = SettingUp;
	static SetupError = SetupError;
	static Handshake = Handshake;
	static Busy = Busy;
	static Error = Error;

	constructor () {
		super();
		this.setup();
	}

	async setup () {
		this.set({[SettingUp]: true});

		try {
			const ping = await getServer().ping();

			this.set({
				[SettingUp]: false,
				[Busy]: false,
				[Error]: null,
				[Handshake]: ping
			});
		} catch (e) {
			this.set({
				[SettingUp]: false,
				[SetupError]: e
			});
		}
	}

	get returnURL () {
		const search = global && global.location && global.location.search;
		const params = search ? querystring.parse(search) : {};

		const config = getConfigFor('url');
		const url = typeof config === 'string' ? config : null;

		return params['return'] || url || '/';
	}


	get loginRedirectURL () {
		const {returnURL} = this;
		//TODO: be smarter about this;
		return `${returnURL}?_u=42`;
	}

	get canLogout () {
		const handshake = this.get(Handshake);

		return handshake.hasLink('logon.logout');
	}

	async logout () {
		const handshake = this.get(Handshake);
		const logoutLink = handshake.getLink('logon.logout');

		this.set({[Busy]: true, [Error]: null});

		try {
			//TODO: can this just be fetch? Or can it go through the server? Or does it need to go through the service
			const service = await getService();

			await service.get(logoutLink);

			this.setup();
		} catch (e) {
			this.set({
				[Busy]: false,
				[Error]: e
			});
		}
	}
}