import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import {Text, Routing} from '../../common';

import Styles from './CreateAccount.css';
import Store from './Store';
import {canCreateAccount} from './methods/utils';

const cx = classnames.bind(Styles);

CreateAccount.propTypes = {
	path: PropTypes.string,
	busy: PropTypes.bool,
	handshake: PropTypes.shape({
		hasLink: PropTypes.func
	})
};
function CreateAccount ({path = './signup', busy, handshake}) {
	if (busy || !canCreateAccount(handshake)) { return null; }

	return (
		<Text.Medium className={cx('create-account')} center>
			Need an Account? <Routing.Link to={path}>Get Started.</Routing.Link>
		</Text.Medium>
	);
}

export default Store
	.monitor({
		[Store.Busy]: 'busy',
		[Store.Handshake]: 'handshake'
	})(CreateAccount);

