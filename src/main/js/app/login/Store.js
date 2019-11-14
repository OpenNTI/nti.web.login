import {Stores} from '@nti/lib-store';
import {getServer, getConfigFor} from '@nti/web-client';//eslint-disable-line

const Setup = 'setup';
const HasPing = 'hasPing';
const Handshake = 'handshake';
const Busy = 'busy';
const Error = 'error';

const ReturnURL = 'returnUrl';
const LoginRedirectURL = 'LoginRedirectURL';
const SetBusy = 'setBusy';


export default class LoginStore extends Stores.SimpleStore {
	static Setup = Setup;
	static HasPing = HasPing;
	static Handshake = Handshake;
	static Busy = Busy;
	static Error = Error;
	static ReturnURL = ReturnURL;
	static LoginRedirectURL = LoginRedirectURL;
	static SetBusy = SetBusy;

	async [Setup] () {
		this.set({
			[HasPing]: false,
			[Handshake]: null,
			[Error]: null,
			[Busy]: true
		});

		delete this.currentTask;

		try {
			const ping = await getServer().ping();

			this.set({
				[Busy]: false,
				[HasPing]: true,
				[Handshake]: ping
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
		const {returnURL} = this;
		//TODO: be smarter about this;
		return `${returnURL}?_u=42`;
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
}