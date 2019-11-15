import React from 'react';
import PropTypes from 'prop-types';
import {Form} from '@nti/web-commons';
import {getServer} from '@nti/web-client';//eslint-disable-line

import Store from '../../Store';
import {getLoginLink} from '../utils';

const MoveFocusOn = {
	'Enter': true
};

LoginPasswordMethod.propTypes = {
	loginRedirect: PropTypes.string,
	updateUsername: PropTypes.func,
	getHandshake: PropTypes.func,
	setBusy: PropTypes.func
};
function LoginPasswordMethod ({updateUsername, getHandshake, setBusy, loginRedirect}) {
	const passwordRef = React.useRef();

	const [disabled, setDisabled] = React.useState(true);

	const onValid = () => setDisabled(false);
	const onInvalid = () => setDisabled(true);

	const maybeFocusPassword = (e) => {
		if (e.target.value && MoveFocusOn[e.key] && passwordRef.current) {
			passwordRef.current.focus();
		}
	};

	const onSubmit = async ({json}) => {
		const clear = setBusy();

		try {
			const handshake = await getHandshake(json.username);
			const loginLink = getLoginLink(handshake);

			await getServer().logInPassword(loginLink, json.username, json.password);

			global.location?.replace(loginRedirect);
		} finally {
			clear();
		}
	};

	return (
		<Form disabled={disabled} onValid={onValid} onInvalid={onInvalid} onSubmit={onSubmit}>
			<Form.Input.Text required name="username" placeholder="Username" onChange={updateUsername} onKeyPress={maybeFocusPassword}/>
			<Form.Input.Text required ref={passwordRef} name="password" type="password" placeholder="Password" />
			<Form.SubmitButton>
				Log In
			</Form.SubmitButton>
		</Form>
	);
}

export default Store
	.monitor({
		[Store.LoginRedirectURL]: 'loginRedirect',
		[Store.UpdateUsername]: 'updateUsername',
		[Store.GetHandshakeForUsername]: 'getHandshake',
		[Store.SetBusy]: 'setBusy'
	})(LoginPasswordMethod);