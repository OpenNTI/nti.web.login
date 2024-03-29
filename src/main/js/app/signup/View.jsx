import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';
import { Loading } from '@nti/web-commons';
import { PaddedContainer, Page, Text, Routing } from 'internal/common';

import Store from './Store';
import Form from './Form';
import Unavailable from './Unavailable';

const t = scoped('nti-login.login.View', {
	unavailable: 'Account creation is unavailable at this time.',
});

Signup.propTypes = {
	setup: PropTypes.func.isRequired,
	loading: PropTypes.bool,
	loaded: PropTypes.bool,
	canCreateAccount: PropTypes.bool,
};
function Signup({ setup, loading, loaded, canCreateAccount }) {
	useEffect(() => {
		if (!loading && !loaded) {
			setup();
		}
	});

	return (
		<Page.Content>
			<Page.Header />
			<Page.Body>
				<Page.Description />
				<Loading.Placeholder
					loading={loading}
					fallback={<Loading.Spinner.Large />}
				>
					<PaddedContainer>
						{loaded && !canCreateAccount && (
							<Unavailable error={t('unavailable')} />
						)}
						{loaded && canCreateAccount && <Form />}
					</PaddedContainer>
				</Loading.Placeholder>
			</Page.Body>
			<Page.Footer>
				<Text.Medium center>
					Have an account?{' '}
					<Routing.Link to="../">Log in.</Routing.Link>
				</Text.Medium>
			</Page.Footer>
		</Page.Content>
	);
}

export default Store.connect({
	[Store.Setup]: 'setup',
	[Store.HasPong]: 'hasPong',
	[Store.CanCreateAccount]: 'canCreateAccount',
	[Store.Loading]: 'loading',
	[Store.Loaded]: 'loaded',
})(Signup);
