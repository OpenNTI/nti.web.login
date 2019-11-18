import {Stores} from '@nti/lib-store';
import {getServer} from '@nti/web-client';//eslint-disable-line

import {getAnonymousPing} from '../../data';

const Setup = 'Setup';
const Loading = 'Loading';
const Loaded = 'Loaded';
const CanCreateAccount = 'CanCreateAccount';
const Ping = 'Ping';

const CheckUsername = 'checkUsername';
const LastUsername = 'lastUsername';

const CheckDelay = 150;
const CheckTimeout = 'CheckTimeout';

export default class SignupStore extends Stores.SimpleStore {
	static Setup = Setup;
	static Loading = Loading;
	static CanCreateAccount = CanCreateAccount;
	static CheckUsername = CheckUsername;

	async [Setup] () {
		this.set({
			[Loading]: true,
			[Ping]: null
		});

		try {
			const ping = await getAnonymousPing();

			this.set({
				[Loading]: false,
				[Loaded]: true,
				[Ping]: ping,
				[CanCreateAccount]: ping.hasLink('account.create')
			});
		} catch (e) {
			this.set({
				[Loading]: false,
				[Loaded]: true,
				[CanCreateAccount]: false
			});
		}
	}

	[CheckUsername] (username) {
		if (username.length < 3 || username === this[LastUsername]) { return; }

		this[LastUsername] = username;

		clearTimeout(this[CheckTimeout]);

		return new Promise ((fulfill, reject) => {
			this[CheckTimeout] = setTimeout(async () => {
				try {
					await getServer().preflightAccountCreate({Username: username});
					fulfill();
				} catch (e) {
					if (e.statusCode === 409 && e.code === 'DuplicateUsernameError') { reject(e);}

					//swallow 
				}
			}, CheckDelay);
		});
	}

}