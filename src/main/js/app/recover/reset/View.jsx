import React from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';
import { Loading } from '@nti/web-commons';
import { Page, PaddedContainer } from 'internal/common';

import Store from './Store';
import Form from './Form';

const t = scoped('nti-login.recover.reset.View', {
	title: 'Reset Password',
});

ResetPassword.propTypes = {
	setup: PropTypes.func,
	loading: PropTypes.bool,
	loaded: PropTypes.bool,
};
function ResetPassword({ setup, loading, loaded }) {
	React.useEffect(() => {
		if (!loading && !loaded) {
			setup();
		}
	});

	return (
		<Page.Content>
			<Page.Header />
			<Page.Body>
				<Page.Description subTitle={t('title')} />
				<PaddedContainer>
					<Loading.Placeholder
						loading={!loaded}
						fallback={<Loading.Spinner.Large />}
					>
						<Form />
					</Loading.Placeholder>
				</PaddedContainer>
			</Page.Body>
		</Page.Content>
	);
}

export default Store.connect({
	[Store.Setup]: 'setup',
	[Store.Loading]: 'loading',
	[Store.Loaded]: 'loaded',
})(ResetPassword);
