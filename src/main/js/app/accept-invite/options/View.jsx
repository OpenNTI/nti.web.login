import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';
import { Loading, Hooks, Errors, Theme } from '@nti/web-commons';

import { PaddedContainer, Page, Text, Routing } from '../../../common';
import Store from '../../login/Store';

import Options from './Options';

const { useResolver } = Hooks;
const { isPending, isErrored } = useResolver;

const t = scoped('nti-login.accept-invite.login.View', {
	error:
		'Unable to find an invitation. Please check your email for a link to accept an invitation.',
	inviteInstructions: {
		canCreateAccount:
			"You've been invited to %(brandName)s. Please login or create an account to continue.",
		cannotCreateAccount:
			"You've been invited to %(brandName)s. Please login to your account to continue.",
	},
	setupInstructions: '',
});

function canCreateAccount(handshake) {
	return handshake && handshake.hasLink('account.create');
}

function getInstructions(isAccountSetup, handshake, brandName) {
	if (!handshake) {
		return '';
	}
	if (isAccountSetup) {
		return t('setupInstructions');
	}

	return canCreateAccount(handshake)
		? t('inviteInstructions.canCreateAccount', { brandName })
		: t('inviteInstructions.cannotCreateAccount', { brandName });
}

AcceptInviteOptionsPage.propTypes = {
	isAccountSetup: PropTypes.bool,
	forcePassword: PropTypes.bool,
	invitation: PropTypes.any,
	handshake: PropTypes.object,
	setup: PropTypes.func.isRequired,
	hasPing: PropTypes.bool,
	busy: PropTypes.bool,
	error: PropTypes.any,
};
function AcceptInviteOptionsPage({
	isAccountSetup,
	handshake,
	invitation,
	setup,
	hasPing,
	error: storeError,
	busy,
	forcePassword,
}) {
	const initialLoad = !hasPing && busy;

	React.useEffect(() => {
		if (!hasPing && !busy) {
			setup();
		}
	});

	const loading = isPending(invitation) || initialLoad;
	const error = isErrored(invitation) ? invitation : storeError;

	const theme = Theme.useTheme();
	const { brandName } = theme.getRoot();

	return (
		<Page.Content>
			<Page.Header />
			<Page.Body>
				<Page.Description
					description={getInstructions(
						isAccountSetup,
						handshake,
						brandName
					)}
				/>
				<PaddedContainer>
					<Loading.Placeholder
						loading={loading}
						fallback={<Loading.Spinner.Large />}
					>
						{error && <Errors.Message error={t('error')} />}
						{!error && (
							<Options
								invitation={invitation}
								forcePassword={forcePassword}
							/>
						)}
					</Loading.Placeholder>
				</PaddedContainer>
			</Page.Body>
			{!forcePassword && (
				<Page.Footer>
					<Text.Medium center>
						Have an account?{' '}
						<Routing.Link to="./login">Log in.</Routing.Link>
					</Text.Medium>
				</Page.Footer>
			)}
		</Page.Content>
	);
}

export default Store.connect({
	[Store.Handshake]: 'handshake',
	[Store.Setup]: 'setup',
	[Store.HasPing]: 'hasPing',
	[Store.Error]: 'error',
	[Store.Busy]: 'busy',
})(AcceptInviteOptionsPage);
