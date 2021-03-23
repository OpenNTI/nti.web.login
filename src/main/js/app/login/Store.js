import { Stores } from '@nti/lib-store';
import { getServer } from '@nti/web-client';
import { getPong, getReturnURL, getLoginRedirectURL } from 'internal/data';

const Setup = 'setup';
const Reload = 'reload';
const HasPong = 'hasPong';
const Handshake = 'handshake';
const Pong = 'pong';

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

function getErrorParams() {
	const href = global.location?.href;

	if (!href) {
		return null;
	}

	const url = new URL(href);

	const error = url.searchParams.get('error');
	const failed = url.searchParams.get('failed');
	const message = url.searchParams.get('message');

	if (error) {
		return error;
	}
	if (failed && message) {
		return message;
	}
}

export default class LoginStore extends Stores.SimpleStore {
	static Setup = Setup;
	static Reload = Reload;
	static HasPong = HasPong;
	static Handshake = Handshake;
	static Busy = Busy;
	static SetBusy = SetBusy;
	static Error = Error;

	static ReturnURL = ReturnURL;
	static LoginRedirectURL = LoginRedirectURL;

	static UpdateUsername = UpdateUsername;
	static GetHandshakeForUsername = GetHandshakeForUsername;

	async [Setup]() {
		if (this.get(HasPong)) {
			return;
		}

		this.set({
			[HasPong]: false,
			[Handshake]: null,
			[Error]: null,
			[Busy]: true,
		});

		delete this.currentTask;

		try {
			const pong = await getPong();

			this.set({
				[Busy]: false,
				[HasPong]: true,
				[Handshake]: pong,
				[Pong]: pong,
				[Error]: getErrorParams(),
			});
		} catch (e) {
			this.set({
				[Busy]: false,
				[Error]: e,
			});
		}
	}

	async [Reload]() {
		this.set({
			[Busy]: true,
			[Error]: null,
		});

		delete this.currentTask;

		try {
			const pong = await getPong(true);

			this.set({
				[Busy]: false,
				[Handshake]: pong,
				[Pong]: pong,
			});
		} catch (e) {
			this.set({
				[Busy]: false,
				[Error]: e,
			});
		}
	}

	get [ReturnURL]() {
		return getReturnURL();
	}
	get [LoginRedirectURL]() {
		return getLoginRedirectURL();
	}

	[SetBusy]() {
		const task = {};

		this.currentTask = task;
		this.set({ [Busy]: true });

		return () => {
			if (task === this.currentTask) {
				this.set({ [Busy]: false });
			}
		};
	}

	[UpdateUsername](username) {
		if (username.length < 3) {
			return;
		}

		clearTimeout(this[UpdateTimeout]);

		const updateUsername = async () => {
			try {
				const handshake = await this[GetHandshakeForUsername](username);
				const pong = this.get(Pong);

				this.set({
					[Error]: null,
					[Handshake]: { ...(pong || {}), ...(handshake || {}) },
				});
			} catch (e) {
				this.set({
					[Error]: e,
				});
			}
		};

		this[UpdateTimeout] = setTimeout(updateUsername, UpdateDelay);
	}

	[GetHandshakeForUsername](username) {
		const getHandshake = async () => {
			try {
				const handshake = await getServer().pong(username);

				return handshake;
			} catch (e) {
				if (e.getLink) {
					return e;
				}
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
