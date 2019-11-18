import {Stores} from '@nti/lib-store';
import {getServer} from '@nti/web-client';//eslint-disable-line

import {getAnonymousPing, getReturnURL} from '../../data';

const Setup = 'Setup';
const Loading = 'Loading';
const Loaded = 'Loaded';
const CanCreateAccount = 'CanCreateAccount';
const Ping = 'Ping';
const ReturnURL = 'returnURL';

const Busy = 'Busy';
const SetBusy = 'SetBusy';

const FormatData = 'formatData';

const Preflight = 'Preflight';
const PreflightDelay = 750;

const FieldPreflights = new Map();


function checkPassword (data) {
	if (data.password2 == null) { return; }
	if (data.password2 === data.password) { return; }

	const error = new Error('Passwords do not match.');

	error.field = 'password2';
	throw error;
}

export default class SignupStore extends Stores.SimpleStore {
	static Setup = Setup;
	static Loading = Loading;
	static CanCreateAccount = CanCreateAccount;
	static FormatData = FormatData;
	static Preflight = Preflight;
	static ReturnURL = ReturnURL;
	static Busy = Busy;
	static SetBusy = SetBusy;

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

	get [ReturnURL] () { return getReturnURL();	}

	[FormatData] (data) {
		const formatted = {...data};

		if (formatted.first || formatted.last) {
			formatted.realname = [formatted.first, formatted.last].join(' ');
		}

		delete formatted.first;
		delete formatted.last;
		delete formatted.password2;

		return formatted;
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
					if (field === 'password' || field === 'password2') {
						checkPassword(this.preflightData);
					}

					const formatted = this[FormatData](this.preflightData);
					await getServer().preflightAccountCreate(formatted);
				} catch (e) {
					reject(e);
				} finally {
					FieldPreflights.delete(field);
				}
			}, PreflightDelay);

			FieldPreflights.set(field, timeout);
		});
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