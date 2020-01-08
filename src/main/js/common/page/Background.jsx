import React from 'react';
import classnames from 'classnames/bind';
import {Theme} from '@nti/web-commons';

import Styles from './Styles.css';

const cx = classnames.bind(Styles);

const getBackgroundURL = (background) => {
	if (!background) { return null; }

	const {href, cacheBust} = background;

	return cacheBust ? `${href}?v=${cacheBust}` :  href;
};

export default function PageBackground (props) {
	const background = Theme.useThemeProperty('background');

	return (
		<div
			className={cx('page-container', 'container')}
			style={{
				backgroundImage: `url(${getBackgroundURL(background)})`,
				backgroundSize: 'cover'
			}}
			{...props}
		/>
	);
}