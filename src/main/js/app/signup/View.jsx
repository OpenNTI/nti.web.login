import React from 'react';
import PropTypes from 'prop-types';
import {Link} from '@reach/router';
import {scoped} from '@nti/lib-locale';
import {Loading} from '@nti/web-commons';

import {PaddedContainer} from '../../common';

import Store from './Store';
import Form from './Form';
import Unavailable from './Unavailable';

const t = scoped('nti-login.login.View', {
	unavailable: 'Account creation is unavailable at this time.'
});

Signup.propTypes = {
	setup: PropTypes.func.isRequired,
	loading: PropTypes.bool,
	loaded: PropTypes.bool,
	canCreateAccount: PropTypes.bool
};
function Signup ({setup, loading, loaded, canCreateAccount}) {

	React.useEffect(() => {
		if (!loading && !loaded) {
			setup();
		}
	});


	return (
		<Loading.Placeholder loading={loading} fallback={(<Loading.Spinner.Large />)}>
			<PaddedContainer>
				{!canCreateAccount && (<Unavailable error={t('unavailable')} />)}
				{canCreateAccount && (<Form />)}
				<Link to="/login/">Login</Link>
			</PaddedContainer>
		</Loading.Placeholder>
	);
}

export default Store
	.connect({
		[Store.Setup]: 'setup',
		[Store.HasPing]: 'hasPing',
		[Store.CanCreateAccount]: 'canCreateAccount',
		[Store.Loading]: 'loading',
		[Store.Loaded]: 'loaded'
	})(Signup);