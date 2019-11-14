import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {getServer} from '@nti/web-client';//eslint-disable-line
import {Button, Text, Errors} from '@nti/web-commons';

import Store from '../../Store';

const t = scoped('nti-login.login.methods.continue.Form', {
	alreadyLoggedIn: 'You are already logged in. Would you like to continue or logout?'
});

LoginContinueMethod.propTypes = {
	handshake: PropTypes.shape({
		hasLink: PropTypes.func.isRequired,
		getLink: PropTypes.func.isRequired
	}).isRequired,
	loginURL: PropTypes.string,
	setBusy: PropTypes.func,
	reload: PropTypes.func
};
function LoginContinueMethod ({handshake, loginURL, setBusy, reload}) {
	const [error, setError] = React.useState(null);

	const logoutLink = handshake && handshake.getLink('logon.logout');
	const logout = async () => {
		if (!logoutLink) { return;}

		const clear = setBusy();

		try {
			await getServer().get(logoutLink);
			reload();
		} catch (e) {
			setError(e);
		} finally {
			clear();
		}
	};

	return (
		<div>
			{error && (<Errors.Message error={error} />)}
			<Text.Base>{t('alreadyLoggedIn')}</Text.Base>
			<Button href={loginURL}>Continue</Button>
			{!!logoutLink && (
				<Button onClick={logout}>Logout</Button>
			)}
		</div>
	);
}

export default Store
	.monitor({
		[Store.Setup]: 'reload',
		[Store.SetBusy]: 'setBusy',
		[Store.LoginRedirectURL]: 'loginURL',
		[Store.Handshake]: 'handshake'
	})(LoginContinueMethod);