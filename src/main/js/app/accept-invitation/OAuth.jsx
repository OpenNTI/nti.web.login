import path from 'path';

import React from 'react';
import { Redirect } from '@reach/router';
import PropTypes from 'prop-types';
import {Loading} from '@nti/web-commons';

import Store from '../signup/Store';
import Oauth from '../login/methods/oauth';


function SSO (props) {
	debugger;
	const { handshake, uri, loading, loaded, location, setup } = props;
	const available = Oauth.isAvailable(handshake);

	React.useEffect(() => {
		setup();
	}, [location]);

	if (!available && !loading && loaded) {
		return <Redirect to={path.join(uri, 'signup')} />;
	}
	debugger;
	return (
		<section>
			{loading && (<Loading.Spinner.Large />)}
			{loaded && available && <Oauth.form key={Oauth.name} {...props} />}
		</section>
	);
}

SSO.propTypes = {
	handshake: PropTypes.object,
	uri: PropTypes.string,
	loading: PropTypes.bool,
	loaded: PropTypes.bool,
	setup: PropTypes.func.isRequired,
	location: PropTypes.shape({
		href: PropTypes.string
	}),
};

export default Store
	.connect({
		[Store.Ping]: 'handshake',
		[Store.Loading]: 'loading',
		[Store.Loaded]: 'loaded',
		[Store.Setup]: 'setup',
	})(SSO);
