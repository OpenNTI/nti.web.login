import React from 'react';
import classnames from 'classnames/bind';

import {Text, Routing} from '../../../../common';

import Styles from './Recover.css';

const cx = classnames.bind(Styles);

export default function Recover () {
	return (
		<Text.Body right className={cx('recover')}>
			I forgot my <Routing.Link to="/login/recover/username">username</Routing.Link> or <Routing.Link to="/login/recover/password">password.</Routing.Link>
		</Text.Body>
	);
}