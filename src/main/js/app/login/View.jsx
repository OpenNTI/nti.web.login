import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';
import { Loading } from '@nti/web-commons';
import { PaddedContainer, Page } from 'internal/common';

import Store from './Store';
import Methods from './methods';
import Unavailable from './Unavailable';
import CreateAccount from './CreateAccount';
import SupportLinks from './support-links';

const t = scoped('nti-login.login.View', {
	setupError:
		'Could not communicate with the servers. Please try again later.',
});

Login.propTypes = {
	setup: PropTypes.func.isRequired,
	hasPong: PropTypes.bool,
	error: PropTypes.any,
	busy: PropTypes.bool,
};
function Login({ setup, hasPong, error, busy }) {
	const [forceNextThoughtLogin, setForceNextThoughtLogin] = useState(false);

	const initialLoad = !hasPong && busy;

	useEffect(() => {
		if (!hasPong && !busy) {
			setup();
		}

		const keyListener = e => {
			if (e.ctrlKey && e.shiftKey && e.charCode === 1) {
				setForceNextThoughtLogin(true);
			}
		};

		const clickListener = e => {
			const { clientX, clientY } = e;
			const { innerHeight, innerWidth } = global;

			if (innerHeight == null && innerWidth == null) {
				return;
			}

			if (
				Math.abs(innerWidth - clientX) <= 40 &&
				Math.abs(innerHeight - clientY) <= 40
			) {
				setForceNextThoughtLogin(true);
			}
		};

		if (typeof document !== 'undefined') {
			document.addEventListener('keypress', keyListener);
			document.addEventListener('click', clickListener);
		}

		global.showNextThoughtLogin = () => setForceNextThoughtLogin(true);

		return () => {
			if (typeof document !== 'undefined') {
				document.removeEventListener('keypress', keyListener);
				document.removeEventListener('click', clickListener);
			}
		};
	});

	if (!hasPong && !busy && !error) {
		return null;
	}

	return (
		<Page.Content>
			<Page.Header />
			<Page.Body>
				<Page.Description />
				<Loading.Placeholder
					loading={initialLoad}
					fallback={<Loading.Spinner.Large />}
				>
					<PaddedContainer>
						{error && (
							<Unavailable
								error={hasPong ? error : t('setupError')}
							/>
						)}
						<Methods
							forceNextThoughtLogin={forceNextThoughtLogin}
						/>
						<CreateAccount />
					</PaddedContainer>
				</Loading.Placeholder>
			</Page.Body>
			<Page.Footer>
				<SupportLinks />
			</Page.Footer>
		</Page.Content>
	);
}

export default Store.connect({
	[Store.Setup]: 'setup',
	[Store.HasPong]: 'hasPong',
	[Store.Error]: 'error',
	[Store.Busy]: 'busy',
})(Login);
