import path from 'path';

import React from 'react';
import PropTypes from 'prop-types';
import {Router, Redirect} from '@reach/router';
import {getConfigFor} from '@nti/web-client';//eslint-disable-line

import Forgot from './forgot';
import Reset from './reset';

Recover.propTypes = {
	uri: PropTypes.string
};
export default function Recover ({uri}) {
	return (
		<Router>
			<Reset path="reset" />
			<Forgot path="password" param="password" />
			<Forgot path="username" param="username" />
			<Redirect from="/" to={path.join(uri, 'username')} />
		</Router>
	);
}