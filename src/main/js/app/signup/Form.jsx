import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {scoped} from '@nti/lib-locale';
import {Form, Theme, Loading} from '@nti/web-commons';
import {getServer} from '@nti/web-client';//eslint-disable-line

import {Inputs, Button} from '../../common';

import Store from './Store';
import Styles from './Form.css';
import TermsAndConditions from './terms-and-conditions';

const cx = classnames.bind(Styles);
const t = scoped('nti-login.signup.Form', {
	fullName: 'Full Name',
	email: 'Your Email',
	username: 'Username',
	password: 'Password',
	verifyPassword: 'Verify Password'
});

SignupForm.propTypes = {
	preflight: PropTypes.func,
	returnURL: PropTypes.string,
	busy: PropTypes.bool,
	setBusy: PropTypes.func,
	formatAndCheck: PropTypes.func
};
function SignupForm ({preflight, returnURL, formatAndCheck, busy, setBusy}) {
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

			global.location?.replace(returnURL);
		} catch (e) {
			clear();
			throw e;
		}

		setTimeout(() => clear(), 5000);
	};

	return (
		<>
			{busy && (<Loading.Spinner.Large />)}
			<Form
				className={cx('signup-form', {busy})}
				onChange={onChange}
				onSubmit={onSubmit}
			>
				<Inputs.Text required name="realname" placeholder={t('fullName')} autoFocus />
				<Inputs.Email required name="email" placeholder={t('email')} autoComplete="off" />
				<Inputs.Text required name="Username" placeholder={t('username')} autoComplete="off" />
				<Inputs.Password required name="password" placeholder={t('password')} autoComplete="off"/>
				<Inputs.Password required name="password2" placeholder={t('verifyPassword')} autoComplete="off" />
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