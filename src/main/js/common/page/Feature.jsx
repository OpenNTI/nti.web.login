import React from 'react';
import classnames from 'classnames/bind';
import {Theme} from '@nti/web-commons';

import Styles from './Styles.css';

const cx = classnames.bind(Styles);

export default function PageFeature () {
	return (
		<div className={cx('page-feature', 'feature')}>
			<Theme.Asset name="featured" />
		</div>
	);
}