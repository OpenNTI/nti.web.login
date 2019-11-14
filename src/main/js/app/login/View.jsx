import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {Loading} from '@nti/web-commons';

import Store from './Store';
import Methods from './methods';
import Unavailable from './Unavailable';

const t = scoped('nti-login.login.View', {
	setupError: 'Could not communicate with the servers. Please try again later.'
});

Login.propTypes = {
	settingUp: PropTypes.bool,
	busy: PropTypes.bool,
	setupError: PropTypes.any
};
function Login ({settingUp, busy, setupError}) {
	const loading = settingUp || busy;
	const delay = busy ? 0 : 500;

	return (
		<div>
			<Loading.Placeholder loading={loading} delay={delay} fallback={(<Loading.Spinner.Large />)}>
				{setupError && (<Unavailable error={t('setupError')} />)}
				{!setupError && (<Methods />)}
			</Loading.Placeholder>
		</div>
	);
}

export default Store
	.connect({
		[Store.SettingUp]: 'settingUp',
		[Store.SetupError]: 'setupError',
		[Store.Busy]: 'busy'
	})(Login);