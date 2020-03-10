import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {scoped} from '@nti/lib-locale';
import {Form, Theme, Loading} from '@nti/web-commons';
import {getServer} from '@nti/web-client';//eslint-disable-line

import {Inputs, Button, TermsAndConditions} from '../../common';

import Store from './Store';
import Styles from './Form.css';

const cx = classnames.bind(Styles);
const t = scoped('nti-login.signup.Form', {
	fullName: 'Full Name',
	email: 'Your Email',
	username: 'Username',
	password: 'Password',
	verifyPassword: 'Verify Password'
});

function getFocusedField (defaultValues) {
	if (!defaultValues?.realname) { return 'realname'; }
	if (!defaultValues?.email && !defaultValues?.emailLocked) { return 'email'; }
	if (!defaultValues?.Username) { return 'Username'; }

	return 'password';
}

SignupForm.propTypes = {
	defaultValues: PropTypes.shape({
		realname: PropTypes.string,
		email: PropTypes.string,
		emailLocked: PropTypes.bool,
		Username: PropTypes.string,
	}),
	preflight: PropTypes.func,
	returnURL: PropTypes.string,
	busy: PropTypes.bool,
	setBusy: PropTypes.func,
	formatAndCheck: PropTypes.func
};
function SignupForm ({defaultValues, preflight, returnURL, formatAndCheck, busy, setBusy}) {
	const buttonText = Theme.useThemeProperty('buttonText');

	const onChange = (values, e) => {
		return preflight(values.json, values.getValidationErrors(), e.target?.name);
	};

	const onSubmit = async ({json}) => {
		const clear = setBusy();

		try {
			const resp = await getServer().createAccount(formatAndCheck(json));

			if (resp && resp.Class === 'User') {
				const handshake = await getServer().ping(resp.Username);
				const initialTOSLink = handshake.getLink('content.initial_tos_page');

				if (initialTOSLink) {
					await getServer().delete(initialTOSLink);
				}
			}

			// TODO: Need to handle the resp error when server updates it to not redirect instead.
			global.location?.replace(returnURL);
		} catch (e) {
			clear();
			throw e;
		}

		setTimeout(() => clear(), 5000);
	};

	const EmailCmp = defaultValues?.emailLocked ? Inputs.Hidden : Inputs.Email;
	const autoFocus = getFocusedField(defaultValues);

	return (
		<>
			{busy && (<Loading.Spinner.Large />)}
			<Form
				className={cx('signup-form', {busy})}
				onChange={onChange}
				onSubmit={onSubmit}
			>
				<Inputs.Text
					required
					name="realname"
					label={t('fullName')}
					defaultValue={defaultValues?.realname ?? ''}
					autoFocus={autoFocus === 'realname'}
				/>
				<EmailCmp
					required
					name="email"
					label={t('email')}
					defaultValue={defaultValues?.email ?? ''}
					autoFocus={autoFocus === 'email'}
				/>
				<Inputs.Text
					required
					name="Username"
					label={t('username')}
					autoComplete="off"
					defaultValue={defaultValues?.Username ?? ''}
					autoFocus={autoFocus === 'Username'}
				/>
				<Inputs.Password
					required
					name="password"
					label={t('password')}
					autoComplete="off"
					autoFocus={autoFocus === 'password'}
				/>
				<Inputs.Password
					required
					name="password2"
					label={t('verifyPassword')}
					autoComplete="off"
				/>
				<Button as={Form.SubmitButton} className={cx('submit')}>
					{buttonText}
				</Button>
				<TermsAndConditions />
			</Form>
		</>
	);
}

export default Store
	.monitor({
		[Store.Ping]: 'ping',
		[Store.Preflight]: 'preflight',
		[Store.ReturnURL]: 'returnURL',
		[Store.Busy]: 'busy',
		[Store.SetBusy]: 'setBusy',
		[Store.FormatAndCheckData]: 'formatAndCheck'
	})(SignupForm);
