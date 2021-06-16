import React, { Suspense } from 'react';
import { Router } from '@reach/router';

import { getConfig } from '@nti/web-client';
import { Theme, Page as CommonsPage, useService } from '@nti/web-commons';
import { Page, Theme as LoginTheme } from 'internal/common';

import '@nti/style-common/all.scss';
import '@nti/style-common/variables.css';
import './View.css';

import Login from './login';
import Recover from './recover';
import Signup from './signup';
import AcceptInvite from './accept-invite';

const Catalog = React.lazy(() =>
	/* webpackChunkName: "catalog" */ import('./Catalog')
);

const LOGIN = '/';
const SIGNUP = 'signup';

export default React.forwardRef(function LoginApp(props, ref) {
	React.useImperativeHandle(ref, () => ({}));

	return (
		<Theme.Apply theme={LoginTheme.getTheme()}>
			<Suspense fallback={<div />}>
				<Routes />
			</Suspense>
		</Theme.Apply>
	);
});

const useHasCatalog = () => {
	const s = useService();
	const collection = s.getCollection('Courses', 'Catalog');
	return !!collection;
};

function Routes(props) {
	const catalogAvailable = useHasCatalog();

	const basePath = getConfig('basepath');
	const PATHS = {
		login: `${basePath}${LOGIN}`,
		signup: `${basePath}${SIGNUP}`,
	};
	return (
		<Router basepath={basePath}>
			<Page component={Recover} path="recover/*" scope="recover" />
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
			{catalogAvailable && (
				<Catalog
					path="catalog/*"
					baseroute={`${basePath}catalog`}
					paths={PATHS}
				/>
			)}
			<Page component={Login} path={LOGIN} scope="login" />
			<CommonsPage.Content.NotFound fill default />
		</Router>
	);
}
