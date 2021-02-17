import React from 'react';
import PropTypes from 'prop-types';
import { Loading } from '@nti/web-commons';

import { Page, Text, Routing } from '../../../common';

import Store from './Store';
import Username from './Username';
import Password from './Password';

Forgot.propTypes = {
	location: PropTypes.shape({
		href: PropTypes.string,
	}),
	setup: PropTypes.func,
	loading: PropTypes.bool,
	loaded: PropTypes.bool,
	canResetPassword: PropTypes.bool,
	canResetUsername: PropTypes.bool,
	param: PropTypes.string,
};
function Forgot({
	location,
	setup,
	loading,
	loaded,
	canResetPassword,
	canResetUsername,
	param,
}) {
	React.useEffect(() => {
		if (!loaded && !loading) {
			setup();
		}

		return () => {};
	});

	return (
		<Page.Content>
			<Page.Header />
			<Page.Body>
				<Loading.Placeholder
					loading={!loaded}
					fallback={<Loading.Spinner.Large />}
				>
					{param === 'username' && (
						<Username
							location={location}
							allowed={canResetUsername}
						/>
					)}
					{param === 'password' && (
						<Password
							location={location}
							allowed={canResetPassword}
						/>
					)}
				</Loading.Placeholder>
			</Page.Body>
			<Page.Footer>
				<Text.Medium center>
					<Routing.Link to="../../">Return to Login</Routing.Link>
				</Text.Medium>
			</Page.Footer>
		</Page.Content>
	);
}

export default Store.connect({
	[Store.Setup]: 'setup',
	[Store.Loading]: 'loading',
	[Store.Loaded]: 'loaded',
	[Store.CanResetPassword]: 'canResetPassword',
	[Store.CanResetUsername]: 'canResetUsername',
})(Forgot);
