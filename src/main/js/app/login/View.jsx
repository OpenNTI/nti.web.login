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
	setup: PropTypes.func.isRequired,
	hasPing: PropTypes.bool,
	error: PropTypes.any,
	busy: PropTypes.bool
};
function Login ({setup, hasPing, error, busy}) {
	const initialLoad = !hasPing && busy;

	React.useEffect(() => {
		if (!hasPing && !busy) { setup(); }
		return () => {};
	});

	if (!hasPing && !busy && !error) { return null; }

	return (
		<Loading.Placeholder loading={initialLoad} fallback={(<Loading.Spinner.Large />)}>
			{error && (<Unavailable error={t('setupError')} />)}
			{(!error && !initialLoad && busy) && (<Loading.Spinner.Large />)}
			{!error && (<Methods />)}
		</Loading.Placeholder>
	);
}

export default Store
	.connect({
		[Store.Setup]: 'setup',
		[Store.HasPing]: 'hasPing',
		[Store.Error]: 'error',
		[Store.Busy]: 'busy'
	})(Login);