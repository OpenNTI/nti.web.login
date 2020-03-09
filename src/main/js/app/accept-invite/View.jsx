import React from 'react';
import PropTypes from 'prop-types';
import {Router} from '@reach/router';
import {Hooks} from '@nti/web-commons';

import {getInvitation} from '../../data';

import Login from './login';
import Signup from './signup';

AcceptInvite.propTypes = {
	isAccountSetup: PropTypes.bool
};
export default function AcceptInvite ({isAccountSetup}) {
	const invitation = Hooks.useResolver(() => getInvitation(), []); 

	return (
		<Router>
			<Signup path="signup" isAccountSetup={isAccountSetup} invitation={invitation} />
			<Login path="/" isAccountSetup={isAccountSetup} invitation={invitation} />
		</Router>
	);
}