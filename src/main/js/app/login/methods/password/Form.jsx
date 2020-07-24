import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {Form, Theme, Errors} from '@nti/web-commons';
import {getServer} from '@nti/web-client';//eslint-disable-line

import {Inputs, Button} from '../../../../common';
import Store from '../../Store';
import {getLoginLink} from '../utils';

import Recover from './Recover';

const t = scoped('nti-login.login.methods.password.Form', {
	invalid: 'The username or password you entered is incorrect. Please try again.',
	username: 'Username',
	password: 'Password'
});

const MoveFocusOn = {
	'Enter': true
};

LoginPasswordMethod.propTypes = {
	loginRedirect: PropTypes.string,
	updateUsername: PropTypes.func,
	getHandshake: PropTypes.func,
	setBusy: PropTypes.func
};
function LoginPasswordMethod ({updateUsername, getHandshake, setBusy, loginRedirect}) {
	const buttonText = Theme.useThemeProperty('buttonText');

	const passwordRef = React.useRef();

	const maybeFocusPassword = (e) => {
		if (e.target.value && MoveFocusOn[e.key] && passwordRef.current) {
			passwordRef.current.focus();
		}
	};

	const onSubmit = async ({json}) => {
		const clear = setBusy();

		try {
			const handshake = await getHandshake(json.username);
			const loginLink = getLoginLink(handshake);

			await getServer().logInPassword(loginLink, json.username, json.password);

			global.location?.replace(loginRedirect);
		} catch (e) {
			clear();
			if (e.statusCode === 401) { throw Errors.Messages.mapMessage(e, t('invalid')); }
			throw e;
		}
	};

	return (
		<Form onSubmit={onSubmit}>
			<Inputs.Text required name="username" label={t('username')} onChange={updateUsername} onKeyPress={maybeFocusPassword} autoFocus autocapitalize="none"/>
			<Inputs.Password required ref={passwordRef} name="password" label={t('password')} />
			<Recover />
			<Button as={Form.SubmitButton}>
				{buttonText}
			</Button>
		</Form>
	);
}

export default Store
	.monitor({
		[Store.LoginRedirectURL]: 'loginRedirect',
		[Store.UpdateUsername]: 'updateUsername',
		[Store.GetHandshakeForUsername]: 'getHandshake',
		[Store.SetBusy]: 'setBusy'
	})(LoginPasswordMethod);
