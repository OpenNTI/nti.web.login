import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Theme } from '@nti/web-commons';
import { Button, Routing } from 'internal/common/';
import Store from 'internal/app/login/Store';
import LoginMethods from 'internal/app/login/methods';
import CreateAccount from 'internal/app/login/CreateAccount';

const { Continue, Password, Oauth } = LoginMethods;

function canCreateAccount(handshake) {
	return handshake && handshake.hasLink('account.create');
}

const Options = [
	{
		isAvailable: ({ hasContinue }) => hasContinue,
		getContent: () => [<Continue.Form key="continue" />],
	},
	{
		isAvailable: ({ forcePassword }) => forcePassword,
		getContent: ({ hasPassword }) => [
			hasPassword ? (
				<LoginMethods key="password" />
			) : (
				<Routing.Redirect to="./" key="password-redirect" />
			),
			<CreateAccount key="create-account" />,
		],
	},
	{
		isAvailable: ({ hasOauth, hasCreation }) => !hasOauth && hasCreation,
		getContent: () => [<SignUp key="sign-up-redirect" />],
	},
	{
		isAvailable: () => true,
		getContent: ({ hasCreation }) => [
			<Oauth.Form key="oauth" />,
			hasCreation ? (
				<Button as={Routing.Link} to="./signup">
					Create an Account
				</Button>
			) : null,
		],
	},
];

AcceptInviteOptions.propTypes = {
	handshake: PropTypes.object.isRequired,
	invitation: PropTypes.object.isRequired,
	forcePassword: PropTypes.bool,
};
function AcceptInviteOptions({ handshake, invitation, forcePassword }) {
	const theme = Theme.useTheme();

	const state = {
		hasContinue: Continue.isAvailable(handshake),
		hasOauth: Oauth.isAvailable(handshake),
		hasPassword: Password.isAvailable(handshake),
		hasCreation: canCreateAccount(handshake),
		forcePassword,
	};

	const contents = Options.find(option =>
		option.isAvailable(state)
	)?.getContent(state);

	return (
		<Theme.Apply theme={theme.getRoot()}>
			<Theme.Scope scope="login">{contents}</Theme.Scope>
		</Theme.Apply>
	);
}

export default Store.monitor({
	[Store.Handshake]: 'handshake',
})(AcceptInviteOptions);

function SignUp() {
	const [count, setCount] = useState(10);

	useEffect(() => {
		const decrement = () => setCount(n => n - 1);
		if (count <= 0) return;
		const t = setTimeout(decrement, 1000); // count down one second at a time
		return () => clearTimeout(t);
	}, [count]);

	return (
		<Button as={Routing.Link} to="./signup">
			{count > 0 ? (
				<>Sign Up ({count})</>
			) : (
				<Routing.Redirect to="./signup" />
			)}
		</Button>
	);
}
