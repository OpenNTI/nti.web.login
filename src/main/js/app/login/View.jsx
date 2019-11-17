import React from 'react';
import PropTypes from 'prop-types';
import {Link} from '@reach/router';
import {scoped} from '@nti/lib-locale';
import {Loading, Theme} from '@nti/web-commons';

import {PaddedContainer, Text} from '../../common';

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
	const title = Theme.useThemeProperty('title');
	const description = Theme.useThemeProperty('description');
	const subTitle = Theme.useThemeProperty('subTitle');

	const initialLoad = !hasPing && busy;

	React.useEffect(() => {
		if (!hasPing && !busy) { setup(); }
		return () => {};
	});

	if (!hasPing && !busy && !error) { return null; }

	return (
		<Loading.Placeholder loading={initialLoad} fallback={(<Loading.Spinner.Large />)}>
			<PaddedContainer>
				{title && (<Text.H1>{title}</Text.H1>)}
				{description && (<Text.Large>{description}</Text.Large>)}
				{subTitle && (<Text.SubTitle>{subTitle}</Text.SubTitle>)}
				{error && (<Unavailable error={t('setupError')} />)}
				<Methods />
				<Link to="./signup">Create Account</Link>
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