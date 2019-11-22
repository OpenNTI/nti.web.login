import {Stores} from '@nti/lib-store';
import {getServer} from '@nti/web-client';//eslint-disable-line

import {getResetPasswordLink, getReturnURL} from '../../../data';

const Setup = 'setup';
const Loaded = 'Loaded';
const Loading = 'Loading';

const Link = 'link';
const CanResetPassword = 'CanResetPassword';
const ResetPassword = 'ResetPassword';

const ParamValues = 'ParamValues';

const ReturnURL = 'ReturnURL';

export default class ResetPasswordStore extends Stores.SimpleStore {
	static Setup = Setup;
	static Loaded = Loaded;
	static Loading = Loading;
	static CanResetPassword = CanResetPassword;
	static ResetPassword = ResetPassword;
	static ParamValues = ParamValues;
	static ReturnURL = ReturnURL;

	async [Setup] () {
		this.set({
			[Loaded]: false,
			[Loading]: true,
			[CanResetPassword]: null,
			[Link]: null
		});

		try {
			const link = await getResetPasswordLink();

			this.set({
				[Loaded]: true,
				[Loading]: false,
				[Link]: link,
				[CanResetPassword]: !!link
			});
		} catch (e) {
			this.set({
				[Loaded]: true,
				[Loading]: false
			});
		}
	}

	get [ReturnURL] () {
		const returnURL = getReturnURL();

		return `/login/?return=${returnURL}`;
	}

	get [ParamValues] () {
		const {href} = global.location || {};
		const url = href ? new URL(href) : null;

		return {
			username: url ? url.searchParams.get('username') : null,
			id: url ? url.searchParams.get('id') : null
		};
	}


	async [ResetPassword] (data) {
		if (data.password !== data.password2) {
			const e = new Error('Passwords do not match.');
			e.field = 'password2';

			throw e;
		}

		delete data.password2;

		const link = this.get(Link);

		await getServer().post(link, data);
	}
}