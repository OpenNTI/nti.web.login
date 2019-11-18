import React from 'react';
import classnames from 'classnames/bind';
import {Theme} from '@nti/web-commons';

import Styles from './Styles.css';

const cx = classnames.bind(Styles);

export default function PageHeader () {
	return (
		<section className={cx('page-header')}>
			<Theme.Asset name="logo" />
		</section>
	);	
}