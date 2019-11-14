import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {Button, Text, Errors} from '@nti/web-commons';

const t = scoped('nti-login.login.methods.continue.Form', {
	alreadyLoggedIn: 'You are already logged in. Would you like to continue or logout?'
});

//TODO: change the message if there is no logout link

LoginContinueMethod.propTypes = {
	error: PropTypes.any,
	canLogout: PropTypes.bool,
	loginRedirectURL: PropTypes.string,
	logout: PropTypes.func
};
export default function LoginContinueMethod ({error, canLogout, loginRedirectURL, logout}) {
	return (
		<div>
			{error && (<Errors.Message error={error} />)}
			<Text.Base>{t('alreadyLoggedIn')}</Text.Base>
			<Button href={loginRedirectURL}>Continue</Button>
			{canLogout && (
				<Button onClick={logout}>Logout</Button>
			)}
		</div>
	);
}