import React from 'react';
import {Router} from '@reach/router';
import {getConfigFor} from '@nti/web-client';//eslint-disable-line

import '@nti/style-common/variables.css';
import './View.css';

import Login from './login';
import Recover from './recover';
import Signup from './signup';


export default function LoginApp () {
	const basePath = getConfigFor('basepath');

	return (
		<Router basepath={basePath} >
			<Recover path="/recover" />
			<Signup path="/signup" />
			<Login path="/" />
		</Router>
	);
}