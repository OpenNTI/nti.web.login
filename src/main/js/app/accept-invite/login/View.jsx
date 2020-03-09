import React from 'react';
import PropTypes from 'prop-types';
import {Loading, Hooks} from '@nti/web-commons';

import {PaddedContainer, Page} from '../../../common';
import Store from '../../login/Store';

const {useResolver} = Hooks;
const {isPending, isErrored} = useResolver;

AcceptInviteLogin.propTypes = {
	invitation: PropTypes.any,
	handshake: PropTypes.object,
	setup: PropTypes.func.isRequired,
	hasPing: PropTypes.bool,
	busy: PropTypes.bool,
	error: PropTypes.any
};
function AcceptInviteLogin ({invitation, handshake, setup, hasPing, error:storeError, busy}) {
	const initialLoad = !hasPing && busy;

	React.useEffect(() => {
		if (!hasPing && !busy) { setup(); }
	});

	const loading = isPending(invitation) || initialLoad;
	const error = isErrored(invitation) ? invitation : storeError;

	return (
		<Page.Content>
			<Page.Header />
			<Page.Body>
				<Page.Description />
				<PaddedContainer>
					<Loading.Placeholder loading={loading} fallback={(<Loading.Spinner.Large />)}>
						<div>
							{error ? 'Error' : 'Success'}
						</div>
					</Loading.Placeholder>
				</PaddedContainer>
			</Page.Body>
		</Page.Content>
	);
}

export default Store
	.connect({
		[Store.Setup]: 'setup',
		[Store.HasPing]: 'hasPing',
		[Store.Handshake]: 'handshake',
		[Store.Error]: 'error',
		[Store.Busy]: 'busy'
	})(AcceptInviteLogin);