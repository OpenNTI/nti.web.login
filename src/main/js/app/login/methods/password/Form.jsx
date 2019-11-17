import React from 'react';
import PropTypes from 'prop-types';
import {Form} from '@nti/web-commons';
import {getServer} from '@nti/web-client';//eslint-disable-line

import {Inputs, Button} from '../../../../common';
import Store from '../../Store';
import {getLoginLink} from '../utils';

import Recover from './Recover';

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
			<Inputs.Text required name="username" placeholder="Username" onChange={updateUsername} onKeyPress={maybeFocusPassword}/>
			<Inputs.Password required ref={passwordRef} name="password" placeholder="Password" />
			<Recover />
			<Button as={Form.SubmitButton}>
				Log In
			</Button>
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