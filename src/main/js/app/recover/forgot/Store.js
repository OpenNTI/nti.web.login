import {Stores} from '@nti/lib-store';

import {getForgotPasswordLink, getForgotUsernameLink} from '../../../data';

const Setup = 'setup';
const Loaded = 'loaded';
const Loading = 'loading';
const CanResetPassword = 'CanResetPassword';
const CanResetUsername = 'CanResetUsername';

export default class RecoverLogin extends Stores.SimpleStore {
	static Setup = Setup;
	static Loaded = Loaded;
	static Loading = Loading;
	static CanResetPassword = CanResetPassword;
	static CanResetUsername = CanResetUsername;

	async [Setup] () {
		this.set({[Loaded]: false, [Loading]: true});

		try {
			const password = await getForgotPasswordLink();
			const username = await getForgotUsernameLink();

			this.set({
				[Loaded]: true,
				[Loading]: false,
				[CanResetUsername]: !!username,
				[CanResetPassword]: !!password
			});
		} catch (e) {
			this.set({
				[Loaded]: true,
				[Loading]: false,
				[CanResetUsername]: false,
				[CanResetPassword]: false
			});
		}
	}
}