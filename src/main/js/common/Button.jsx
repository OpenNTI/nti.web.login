import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';

import { Theme } from '@nti/web-commons';

import styles from './Button.css';

const _cx = cx.bind(styles);

Button.propTypes = {
	as: PropTypes.any,
	className: PropTypes.string,
	secondary: PropTypes.bool,
	background: PropTypes.string,
	theme: PropTypes.string,
};
export default function Button({
	as: tag,
	className,
	secondary,
	background: backgroundProp,
	theme: themeProp,
	...otherProps
}) {
	const Cmp = tag || 'button';

	const tBackground = Theme.useThemeProperty('buttonBackground');
	const tTheme = Theme.useThemeProperty('buttonTheme');

	const background =
		backgroundProp === undefined ? tBackground : backgroundProp;
	const theme = themeProp === undefined ? tTheme : themeProp;

	return (
		<Cmp
			{...otherProps}
			style={{
				background: background && !secondary ? background : undefined,
			}}
			className={cx(
				className,
				'button',
				_cx('button', theme, { secondary })
			)}
			tabIndex={0}
			role="button"
		/>
	);
}
