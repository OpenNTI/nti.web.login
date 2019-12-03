import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Theme} from '@nti/web-commons';

import Styles from './Button.css';

const cx = classnames.bind(Styles);

Button.propTypes = {
	as: PropTypes.any,
	className: PropTypes.string,
	secondary: PropTypes.bool,
	background: PropTypes.string,
	theme: PropTypes.string
};
export default function Button ({as: tag, className, secondary, background: backgroundProp, theme: themeProp, ...otherProps}) {
	const Cmp = tag || 'button';

	const background = backgroundProp === undefined ? Theme.useThemeProperty('buttonBackground') : backgroundProp;
	const theme = themeProp === undefined ?  Theme.useThemeProperty('buttonTheme') : themeProp;

	const styles = {};

	if (background && !secondary) {
		styles.background = background;
	}

	return (
		<Cmp
			{...otherProps}
			style={styles}
			className={cx(className, 'button', theme, {secondary})}
			tabIndex={0}
			role="button"
		/>
	);
}