import {Stores} from '@nti/lib-store';
import {getServer, getConfigFor} from '@nti/web-client';//eslint-disable-line

import {getAnonymousPing} from '../../data';

const Setup = 'setup';
const Reload = 'reload';
const HasPing = 'hasPing';
const Handshake = 'handshake';
const Ping = 'ping';

const Busy = 'busy';
const Error = 'error';
const SetBusy = 'setBusy';

const ReturnURL = 'returnUrl';
const LoginRedirectURL = 'LoginRedirectURL';

const UpdateUsername = 'UpdateUsername';
const GetHandshakeForUsername = 'GetHandshakeForUsername';

const UpdateDelay = 150;
const UpdateTimeout = Symbol('Update Timeout');

const HandshakeMap = new Map();

function getErrorParams () {
	const href = global.location?.href;

	if (!href) { return null; }

	const url = new URL(href);

	const error = url.searchParams.get('error');
	const failed = url.searchParams.get('failed');
	const message = url.searchParams.get('message');

	if (error) { return error; }
	if (failed && message) { return message; }
}

export default class LoginStore extends Stores.SimpleStore {
	static Setup = Setup;
	static Reload = Reload;
	static HasPing = HasPing;
	static Handshake = Handshake;
	static Busy = Busy;
	static SetBusy = SetBusy;
	static Error = Error;

	static ReturnURL = ReturnURL;
	static LoginRedirectURL = LoginRedirectURL;

	static UpdateUsername = UpdateUsername;
	static GetHandshakeForUsername = GetHandshakeForUsername;

	async [Setup] () {
		if (this.get(HasPing)) { return; }

		this.set({
			[HasPing]: false,
			[Handshake]: null,
			[Error]: null,
			[Busy]: true
		});

		delete this.currentTask;

		try {
			const ping = await getAnonymousPing();

			this.set({
				[Busy]: false,
				[HasPing]: true,
				[Handshake]: ping,
				[Ping]: ping,
				[Error]: getErrorParams()
			});
		} catch (e) {
			this.set({
				[Busy]: false,
				[Error]: e
			});
		}
	}

	async [Reload] () {
		this.set({
			[Busy]: true,
			[Error]: null
		});

		delete this.currentTask;

		try {
			const ping = await getAnonymousPing(true);

			this.set({
				[Busy]: false,
				[Handshake]: ping,
				[Ping]: ping
			});
		} catch (e) {
			this.set({
				[Busy]: false,
				[Error]: e
			});
		}
	}


	get [ReturnURL] () {
		const {href} = global.location || {};
		const url = href ? new URL(href) : null;

		const returnParam = url?.searchParams?.get('return');

		const config = getConfigFor('url');
		const configURL = typeof config === 'string' ? config : null;

		return returnParam || configURL || '/';
	}

	get [LoginRedirectURL] () {
		//TODO: be smarter about this;
		return `${this[ReturnURL]}?_u=42`;
	}

	[SetBusy] () {
		const task = {};

		this.currentTask = task;
		this.set({[Busy]: true});

		return () => {
			if (task === this.currentTask) {
				this.set({[Busy]: false});
			}
		};
	}

	[UpdateUsername] (username) {
		if (username.length < 3) { return; }

		clearTimeout(this[UpdateTimeout]);

		const updateUsername = async () => {
			try {
				const handshake = await this[GetHandshakeForUsername](username);
				const ping = this.get(Ping);

				this.set({
					[Error]: null,
					[Handshake]: {...(ping || {}), ...(handshake || {})}
				});
			} catch (e) {
				this.set({
					[Error]: e
				});
			}
		};

		this[UpdateTimeout] = setTimeout(updateUsername, UpdateDelay);
	}


	[GetHandshakeForUsername] (username) {
		const getHandshake = async () => {
			try {
				const handshake = await getServer().ping(username);

				return handshake;
			} catch (e) {
				if (e.getLink) { return e; }
				throw e;
			}
		};

		if (!HandshakeMap.has(username)) {
			//only keep track of the last handshake
			HandshakeMap.clear();
			HandshakeMap.set(username, getHandshake());
		}

		return HandshakeMap.get(username);
	}

}