import {Stores} from '@nti/lib-store';
import {getServer} from '@nti/web-client';//eslint-disable-line

import {getAnonymousPing} from '../../data';

const Setup = 'Setup';
const Loading = 'Loading';
const Loaded = 'Loaded';
const CanCreateAccount = 'CanCreateAccount';
const Ping = 'Ping';

const Preflight = 'Preflight';
const PreflightDelay = 750;

const FieldPreflights = new Map();

function formatData (data) {
	const formatted = {...data};

	if (formatted.first || formatted.last) {
		formatted.realname = [formatted.first, formatted.last].join(' ');
	}

	delete formatted.first;
	delete formatted.last;

	return formatted;
}

export default class SignupStore extends Stores.SimpleStore {
	static Setup = Setup;
	static Loading = Loading;
	static CanCreateAccount = CanCreateAccount;
	static Preflight = Preflight;

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

	[Preflight] (data, field = 'all') {
		const inflight = FieldPreflights.get(field);

		this.preflightData = this.preflightData || {};

		if (field === 'all') {
			this.preflightData = data;
		} else {
			this.preflightData[field] = data[field];
		}

		clearTimeout(inflight);

		return new Promise((fulfill, reject) => {
			const timeout = setTimeout(async () => {
				try {
					await getServer().preflightAccountCreate(formatData(this.preflightData));
				} catch (e) {
					reject(e);
				} finally {
					FieldPreflights.delete(field);
				}
			}, PreflightDelay);

			FieldPreflights.set(field, timeout);
		});
	}
}