import React from 'react';
import PropTypes from 'prop-types';
import {Redirect, Link} from '@reach/router';
import {Theme} from '@nti/web-commons';

import {Button} from '../../../common/';
import Store from '../../login/Store';
import LoginMethods from '../../login/methods';
import CreateAccount from '../../login/CreateAccount';

const {Continue, Password, Oauth} = LoginMethods;

function canCreateAccount (handshake) {
	return handshake && handshake.hasLink('account.create');
}

const Options = [
	{
		isAvailable: ({hasContinue}) => hasContinue,
		getContent: () => ([<Continue.Form key="continue" />])
	},
	{
		isAvailable: ({forcePassword}) => forcePassword,
		getContent: ({hasPassword}) => ([
			hasPassword ?
				(<LoginMethods key="password" />) :
				(<Redirect to="./" key="password-redirect" />),
			(<CreateAccount key="create-account" />)
		])
	},
	{
		isAvailable: ({hasOauth, hasCreation}) => !hasOauth && hasCreation,
		getContent: () => ([<Redirect to="./signup" key="signup-redirect" />])
	},
	{
		isAvailable: () => true,
		getContent: ({hasCreation}) => ([
			(<Oauth.Form key="oauth" />),
			hasCreation ? (<Button as={Link} to="./signup">Create an Account</Button>) : null
		])
	}
];


AcceptInviteOptions.propTypes = {
	handshake: PropTypes.object.isRequired,
	invitation: PropTypes.object.isRequired,
	forcePassword: PropTypes.bool
};
function AcceptInviteOptions ({handshake, invitation, forcePassword}) {
	const theme = Theme.useTheme();

	const state = {
		hasContinue: Continue.isAvailable(handshake),
		hasOauth: Oauth.isAvailable(handshake),
		hasPassword: Password.isAvailable(handshake),
		hasCreation: canCreateAccount(handshake),
		forcePassword
	};

	const contents = Options
		.find(option => option.isAvailable(state))
		?.getContent(state);


	return (
		<Theme.Apply theme={theme.getRoot()}>
			<Theme.Scope scope="login">
				{contents}
			</Theme.Scope>
		</Theme.Apply>
	);
}

export default Store
	.monitor({
		[Store.Handshake]: 'handshake'
	})(AcceptInviteOptions);