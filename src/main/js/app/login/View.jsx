import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {Loading} from '@nti/web-commons';

import {PaddedContainer} from '../../common';

import Store from './Store';
import Methods from './methods';
import Unavailable from './Unavailable';
import CreateAccount from './CreateAccount';

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
	const [forceNextThoughtLogin, setForceNextThoughtLogin] = React.useState(false);

	const initialLoad = !hasPing && busy;

	React.useEffect(() => {
		if (!hasPing && !busy) { setup(); }

		const keyListener = (e) => {
			if (e.ctrlKey && e.shiftKey && e.charCode === 1) {
				setForceNextThoughtLogin(true);
			}
		};

		const clickListener = (e) => {
			const {clientX, clientY} = e;
			const {innerHeight, innerWidth} = global;

			if (innerHeight == null && innerWidth == null) { return; }

			if (Math.abs(innerWidth - clientX) <= 40 && Math.abs(innerHeight - clientY) <= 40) {
				setForceNextThoughtLogin(true);
			}
		};

		if (typeof document !== 'undefined') {
			document.addEventListener('keypress', keyListener);
			document.addEventListener('click', clickListener);
		}

		return () => {
			if (typeof document !== 'undefined') {
				document.removeEventListener('keypress', keyListener);
				document.removeEventListener('click', clickListener);
			}
		};
	});

	if (!hasPing && !busy && !error) { return null; }

	return (
		<Loading.Placeholder loading={initialLoad} fallback={(<Loading.Spinner.Large />)}>
			<PaddedContainer>
				{error && (<Unavailable error={hasPing ? error : t('setupError')} />)}
				<Methods forceNextThoughtLogin={forceNextThoughtLogin} />
				<CreateAccount />
			</PaddedContainer>
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