import React from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';
import { Loading, Errors, Theme, Hooks } from '@nti/web-commons';
import { PaddedContainer, Page, Text, Routing } from 'internal/common';

import Store from '../../signup/Store';
import Form from '../../signup/Form';

const { isPending } = Hooks.useResolver;

const t = scoped('nti-login.accept-invite.signup.View', {
	unavailable: 'Account creation is unavailable at this time.',
});

function getSignupDefaultsFromInvite(invite) {
	return {
		realname: invite?.receiverName,
		email: invite?.receiver,
		emailLocked: invite?.requireMatchingEmail,
	};
}

AcceptInviteSignup.propTypes = {
	invitation: PropTypes.object.isRequired,
	setup: PropTypes.func.isRequired,
	loading: PropTypes.bool,
	loaded: PropTypes.bool,
	canCreateAccount: PropTypes.bool,
};
function AcceptInviteSignup({
	invitation,
	setup,
	loading,
	loaded,
	canCreateAccount,
}) {
	const theme = Theme.useTheme();
	const inviteLoading = isPending(invitation);

	React.useEffect(() => {
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
					loading={loading || inviteLoading}
					fallback={<Loading.Spinner.Large />}
				>
					<PaddedContainer>
						{loaded && !canCreateAccount && (
							<Errors.Message error={t('unavailable')} />
						)}
						{loaded && canCreateAccount && (
							<Theme.Apply theme={theme.getRoot()}>
								<Theme.Scope scope="signup">
									<Form
										defaultValues={getSignupDefaultsFromInvite(
											invitation
										)}
									/>
								</Theme.Scope>
							</Theme.Apply>
						)}
					</PaddedContainer>
				</Loading.Placeholder>
			</Page.Body>
			<Page.Footer>
				<Text.Medium center>
					Have an account?{' '}
					<Routing.Link to="../login">Log in.</Routing.Link>
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
})(AcceptInviteSignup);
