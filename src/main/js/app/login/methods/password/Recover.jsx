import React from 'react';
import {Link} from '@reach/router';
import classnames from 'classnames/bind';

import {Text} from '../../../../common';

import Styles from './Recover.css';

const cx = classnames.bind(Styles);

export default function Recover () {
	return (
		<Text.Body right className={cx('recover')}>
			I forgot my <Link to="/login/recover?f=username">username</Link> or <Link to="/login/recover?f=password">password.</Link>
		</Text.Body>
	);
}