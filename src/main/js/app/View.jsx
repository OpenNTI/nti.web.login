import React, { Suspense } from 'react';
import { Redirect, Router, useLocation } from '@reach/router';

import { getConfig } from '@nti/web-client';
import {
	Theme,
	Page as CommonsPage,
	useService,
	Layouts,
} from '@nti/web-commons';
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

const AppRedirect = () => {
	const location = useLocation();
	const basepath = getConfig('basepath');
	const appPath = Layouts.Responsive.isMobile() ? '/mobile/' : '/app/';

	React.useEffect(
		() =>
			void global.location.replace(
				location.pathname.replace(basepath, appPath)
			)
	);

	return null;
};

const useHasCatalog = () => {
	const s = useService();
	const collection = s.getCollection('Courses', 'Catalog');
	return !!collection;
};

function Routes(props) {
	const { isAnonymous } = useService();
	const catalogAvailable = useHasCatalog();
	const isLoggedIn = !isAnonymous;

	const basePath = getConfig('basepath');
	const PATHS = {
		login: `${basePath}${LOGIN}`,
		signup: `${basePath}${SIGNUP}`,
	};

	function MaybeRedirect({ to = PATHS.login, when = isLoggedIn, ...props }) {
		return when ? <Redirect to={to} noThrow /> : <Page {...props} />;
	}

	return (
		<Router basepath={basePath}>
			<MaybeRedirect
				component={Recover}
				path="recover/*"
				scope="recover"
			/>
			<MaybeRedirect component={Signup} path={SIGNUP} scope="signup" />
			<MaybeRedirect
				component={AcceptInvite}
				path="account-setup/*"
				scope="accountSetup"
				isAccountSetup
			/>
			<MaybeRedirect
				component={AcceptInvite}
				path="accept-invite/*"
				scope="acceptInvitation"
			/>
			{catalogAvailable &&
				(isAnonymous ? (
					<Catalog
						path="catalog/*"
						baseroute={`${basePath}catalog`}
						paths={PATHS}
					/>
				) : (
					<AppRedirect path="catalog/*" />
				))}
			<Page component={Login} path={LOGIN} scope="login" />
			<CommonsPage.Content.NotFound fill default />
		</Router>
	);
}
