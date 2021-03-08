import React from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';
import { getServer } from '@nti/web-client';
import { Errors } from '@nti/web-commons';
import { Text, Button } from 'internal/common';

import Store from '../../Store';

import UserInfo from './UserInfo';

const t = scoped('nti-login.login.methods.continue.Form', {
	loggedIn: 'You are already logged in as:',
	continue: 'Would you like to continue or logout?',
});

LoginContinueMethod.propTypes = {
	handshake: PropTypes.shape({
		hasLink: PropTypes.func.isRequired,
		getLink: PropTypes.func.isRequired,
	}).isRequired,
	loginURL: PropTypes.string,
	setBusy: PropTypes.func,
	reload: PropTypes.func,
};
function LoginContinueMethod({ handshake, loginURL, setBusy, reload }) {
	const [error, setError] = React.useState(null);

	const logoutLink = handshake && handshake.getLink('logon.logout');
	const logout = async () => {
		if (!logoutLink) {
			return;
		}

		const clear = setBusy();

		try {
			await getServer().get(logoutLink);
			reload();
		} catch (e) {
			setError(e);
			clear();
		}
	};

	return (
		<div>
			{error && <Errors.Message error={error} />}
			<Text.Large>{t('loggedIn')}</Text.Large>
			<UserInfo />
			<Button as="a" href={loginURL}>
				Continue
			</Button>
			{!!logoutLink && (
				<Button onClick={logout} secondary>
					Logout
				</Button>
			)}
		</div>
	);
}

export default Store.monitor({
	[Store.Reload]: 'reload',
	[Store.SetBusy]: 'setBusy',
	[Store.LoginRedirectURL]: 'loginURL',
	[Store.Handshake]: 'handshake',
})(LoginContinueMethod);
