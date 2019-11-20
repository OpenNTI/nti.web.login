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
	verifyPassword: 'Verify Password',
	emailUpdates: 'Send me email updates about NextThought.'
});

SignupForm.propTypes = {
	preflight: PropTypes.func,
	returnURL: PropTypes.string,
	busy: PropTypes.bool,
	setBusy: PropTypes.func,
	formatData: PropTypes.func
};
function SignupForm ({preflight, returnURL, formatData, busy, setBusy}) {
	const buttonText = Theme.useThemeProperty('buttonText');

	const onChange = ({json}, e) => {
		return preflight(json, e.target?.name);
	};

	const onSubmit = async ({json}) => {
		const clear = setBusy();

		try {
			const resp = await getServer().createAccount(formatData(json));

			if (resp && resp.Class === 'User') {
				const handshake = await getServer().ping(resp.Username);
				const initialTOSLink = handshake.getLink('content.initial_tos_page');

				if (initialTOSLink) {
					await getServer().delete(initialTOSLink);
				}
			}

			global.location?.replace(returnURL);
		} finally {
			clear();
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
				<Inputs.Email required name="email" placeholder={t('email')} />
				<Inputs.Text required name="Username" placeholder={t('username')} />
				<Inputs.Password required name="password" placeholder={t('password')}/>
				<Inputs.Password required name="password2" placeholder={t('verifyPassword')} />
				<Inputs.Checkbox name="opt_in_email_communication" label={t('emailUpdates')} defaultChecked />
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
		[Store.FormatData]: 'formatData'
	})(SignupForm);