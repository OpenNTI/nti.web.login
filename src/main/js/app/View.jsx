import React from 'react';
import {Router} from '@reach/router';
import {getConfigFor} from '@nti/web-client';//eslint-disable-line
import {Theme} from '@nti/web-commons';

import {Page, Theme as LoginTheme} from '../common';

import '@nti/style-common/variables.css';
import './View.css';

import Login from './login';
import Recover from './recover';
import Signup from './signup';
import AcceptInvitation from './accept-invitation';

export default function LoginApp () {
	const basePath = getConfigFor('basepath');

	return (
		<Theme.Apply theme={LoginTheme.getTheme()}>
			<Router basepath={basePath} >
				<Page component={Recover} path="recover/*" scope="recover" position={3} />
				<Page component={Signup} path="signup" scope="signup"  position={2} />
				<Page component={AcceptInvitation} path="account-setup/*" scope="accountSetup" position={2} isInvitation={false} />
				<Page component={Login} path="/" scope="login" position={1} />
			</Router>
		</Theme.Apply>
	);
}
