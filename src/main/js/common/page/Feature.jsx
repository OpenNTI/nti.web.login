import React from 'react';
import classnames from 'classnames/bind';

import Styles from './Styles.css';

const cx = classnames.bind(Styles);

export default function PageFeature (props) {
	return (
		<div className={cx('page-feature', 'feature')} />
	);
}