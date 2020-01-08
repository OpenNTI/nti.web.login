import React from 'react';
import { Router, Location } from '@reach/router';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { getConfigFor } from '@nti/web-client';//eslint-disable-line
import { Theme } from '@nti/web-commons';

import { Page, Theme as LoginTheme } from '../common';

import '@nti/style-common/variables.css';
import './View.css';

import Login from './login';
import Recover from './recover';
import Signup from './signup';

export default function LoginApp () {
	const basePath = getConfigFor('basepath');
	let transitions = 0;
	let lastLocation;

	const countPaths = (location) => {
		return location?.pathname?.match(/\//g)?.length ?? 0;
	};

	return (
		<Theme.Apply theme={LoginTheme.getTheme()}>
			<Location>
				{({ location }) => {
					let component = (
						<TransitionGroup className={
							countPaths(location) > countPaths(lastLocation)
								? 'transition-left'
								: 'transition-right'
						}>
							<CSSTransition
								key={location.key}
								classNames={'transition'}
								addEndListener={(node, done) => {
									node.addEventListener('transitionrun', () => {
										transitions++;
									});
									node.addEventListener('transitionend', () => {
										transitions--;
										if(transitions <= 0) {
											done();
										}
									});
								}}
								timeout={700}
							>
								<Router basepath={basePath} location={location}>
									<Page component={Recover} path="recover/*" scope="recover" position={3} />
									<Page component={Signup} path="signup" scope="signup" position={2} />
									<Page component={Login} path="/*" scope="login" position={1} />
								</Router>
							</CSSTransition>
						</TransitionGroup>
					);
					lastLocation = location;
					return component;
				}}
			</Location>
		</Theme.Apply>
	);
}