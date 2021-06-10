import React, { lazy, Suspense } from 'react';
import { Router } from '@reach/router';

import { getConfig } from '@nti/web-client';
import { Theme } from '@nti/web-commons';
import { Page, Theme as LoginTheme } from 'internal/common';

import '@nti/style-common/all.scss';
import '@nti/style-common/variables.css';
import './View.css';

import Login from './login';
import Recover from './recover';
import Signup from './signup';
import AcceptInvite from './accept-invite';

const Catalog = lazy(() =>
	/* webpackChunkName: "catalog" */ import('./catalog')
);

const LOGIN = '/';
const SIGNUP = 'signup';

export default React.forwardRef(function LoginApp(props, ref) {
	const basePath = getConfig('basepath');
	React.useImperativeHandle(ref, () => ({}));

	const PATHS = {
		login: `${basePath}${LOGIN}`,
		signup: `${basePath}${SIGNUP}`,
	};

	return (
		<Theme.Apply theme={LoginTheme.getTheme()}>
			<Suspense fallback={<div />}>
				<Router basepath={basePath}>
					<Page
						component={Recover}
						path="recover/*"
						scope="recover"
					/>
					<Page component={Signup} path={SIGNUP} scope="signup" />
					<Page
						component={AcceptInvite}
						path="account-setup/*"
						scope="accountSetup"
						isAccountSetup
					/>
					<Page
						component={AcceptInvite}
						path="accept-invite/*"
						scope="acceptInvitation"
					/>
					<Catalog
						path="catalog/*"
						baseroute={`${basePath}catalog`}
						paths={PATHS}
					/>
					<Page component={Login} path={LOGIN} scope="login" />
				</Router>
			</Suspense>
		</Theme.Apply>
	);
});
