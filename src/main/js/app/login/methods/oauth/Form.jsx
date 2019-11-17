import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Store from '../../Store';
import {getOauthLinks} from '../utils';

import Styles from './Styles.css';
import Button from './Button';

const cx = classnames.bind(Styles);

LoginOauthMethod.propTypes = {
	handshake: PropTypes.object
};
function LoginOauthMethod ({handshake, ...otherProps}) {
	const links = getOauthLinks(handshake);

	if (!links || !links.length) { return null; }

	return (
		<ul className={cx('oauth-buttons')}>
			{links.map((link) => {
				return (
					<li key={link.rel}>
						<Button link={link} {...otherProps} />
					</li>
				);
			})}
		</ul>
	);
}

export default Store
	.monitor({
		[Store.ReturnURL]: 'returnURL',
		[Store.SetBusy]: 'setBusy',
		[Store.Handshake]: 'handshake'
	})(LoginOauthMethod);