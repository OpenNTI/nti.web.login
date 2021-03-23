import { Stores } from '@nti/lib-store';
import { getServer, getService } from '@nti/web-client'; //eslint-disable-line
import { getPong, getReturnURL } from 'internal/data';

const Setup = 'Setup';
const Loading = 'Loading';
const Loaded = 'Loaded';
const CanCreateAccount = 'CanCreateAccount';
const Pong = 'Pong';
const ReturnURL = 'returnURL';

const Busy = 'Busy';
const ErrorState = 'error';
const SetBusy = 'SetBusy';

const FormatData = 'formatData';
const FormatAndCheckData = 'formatAndCheckData';

const Preflight = 'Preflight';
const PreflightDelay = 750;

const FieldPreflight = new Map();
const FieldTasks = new Map();

const Prefill = 'Prefill';

function checkPassword(data) {
	if (data?.password2 == null) {
		return;
	}
	if (data?.password2 === data?.password) {
		return;
	}

	const error = new Error('Passwords do not match.');

	error.field = 'password2';
	throw error;
}

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

export default class SignupStore extends Stores.SimpleStore {
	static Setup = Setup;
	static Loading = Loading;
	static Loaded = Loaded;
	static CanCreateAccount = CanCreateAccount;
	static FormatData = FormatData;
	static FormatAndCheckData = FormatAndCheckData;
	static Preflight = Preflight;
	static ReturnURL = ReturnURL;
	static Busy = Busy;
	static SetBusy = SetBusy;
	static Prefill = Prefill;
	static ErrorState = ErrorState;
	static Pong = Pong;

	async [Setup](isAdminInvitation) {
		this.set({
			[Loading]: true,
			[Pong]: null,
		});

		try {
			const pong = await getPong();

			this.set({
				[Loading]: false,
				[Loaded]: true,
				[Pong]: pong,
				[CanCreateAccount]: pong.hasLink('account.create'),
				[ErrorState]: getErrorParams(),
			});
		} catch (e) {
			this.set({
				[Loading]: false,
				[Loaded]: true,
				[CanCreateAccount]: false,
			});
		}
	}

	get [ReturnURL]() {
		return getReturnURL();
	}

	[FormatData](data) {
		const formatted = { ...data, opt_in_email_communication: null };

		delete formatted.password2;

		return formatted;
	}

	[FormatAndCheckData](data) {
		checkPassword(data);

		return this[FormatData](data);
	}

	[Preflight](data, errors = {}, field = 'all') {
		const inflight = FieldPreflight.get(field);

		this.preflightData = this.preflightData || {};

		if (field === 'all') {
			this.preflightData = data;
		} else {
			this.preflightData[field] = data[field];
		}

		clearTimeout(inflight);

		const task = {};

		FieldTasks.set(field, task);

		return new Promise((fulfill, reject) => {
			const timeout = setTimeout(async () => {
				const isCurrentTask = FieldTasks.get(field) === task;
				const pong = this.get(Pong);

				if (errors?.[field]) {
					const e = new Error(errors[field]);
					e.field = field;
					reject(e);
					return;
				}

				try {
					if (field === 'password' || field === 'password2') {
						checkPassword(this.preflightData);
					}

					const formatted = this[FormatData](this.preflightData);
					await getServer().post(
						pong.getLink('account.preflight.create'),
						formatted
					);
				} catch (e) {
					if (!isCurrentTask) {
						return;
					}

					if (errors?.[e.field]) {
						const err = new Error(errors[e.field]);
						err.field = e.field;
						reject(err);
						return;
					}

					reject(e);
				} finally {
					FieldPreflight.delete(field);
				}
			}, PreflightDelay);

			FieldPreflight.set(field, timeout);
		});
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
}
