import React from 'react';
import PropTypes from 'prop-types';
import {Link} from '@reach/router';
import {Loading} from '@nti/web-commons';

import {Page, Text} from '../../../common';

import Store from './Store';
import Username from './Username';
import Password from './Password';

Forgot.propTypes = {
	location: PropTypes.shape({
		href: PropTypes.string
	}),
	setup: PropTypes.func,
	loading: PropTypes.bool,
	loaded: PropTypes.bool,
	canResetPassword: PropTypes.bool,
	canResetUsername: PropTypes.bool
};
function Forgot ({location, setup, loading, loaded, canResetPassword, canResetUsername}) {
	const [param, setParam] = React.useState(null);

	React.useEffect(() => {
		if (!loaded && !loading) {
			setup();
		}

		return () => {};
	});

	React.useEffect(() => {
		const url = new URL(location.href);

		setParam(url.searchParams.get('f') || 'username');

		return () => {};
	}, [location]);

	return (
		<Page.Content>
			<Page.Header />
			<Page.Body>
				<Loading.Placeholder loading={!loaded} fallback={(<Loading.Spinner.Large />)} >
					{param === 'username' && (<Username location={location} allowed={canResetUsername} />)}
					{param === 'password' && (<Password location={location} allowed={canResetPassword} />)}
				</Loading.Placeholder>
			</Page.Body>
			<Page.Footer>
				<Text.Medium center>
					<Link to="../">Return to Login</Link>
				</Text.Medium>
			</Page.Footer>
		</Page.Content>
	);
}

export default Store
	.connect({
		[Store.Setup]: 'setup',
		[Store.Loading]: 'loading',
		[Store.Loaded]: 'loaded',
		[Store.CanResetPassword]: 'canResetPassword',
		[Store.CanResetUsername]: 'canResetUsername'
	})(Forgot);