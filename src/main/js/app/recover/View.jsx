import React from 'react';
import {Router} from '@reach/router';
import {getConfigFor} from '@nti/web-client';//eslint-disable-line

import Forgot from './forgot';
import Reset from './reset';

export default function Recover (props) {
	return (
		<Router>
			<Reset path="reset" />
			<Forgot path="/" />
		</Router>
	);
}