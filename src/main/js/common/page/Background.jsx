import React from 'react';
import classnames from 'classnames/bind';
import {Theme, Background} from '@nti/web-commons';

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
		<Background
			className={cx('page-container', 'container')}
			imgUrl={getBackgroundURL(background)}
			{...props}
		/>
	);
}