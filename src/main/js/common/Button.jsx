import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './Button.css';

const cx = classnames.bind(Styles);

Button.propTypes = {
	as: PropTypes.any,
	className: PropTypes.string
};
export default function Button ({as: tag, className, ...otherProps}) {
	const Cmp = tag || 'button';

	return (
		<Cmp className={cx(className, 'button')} {...otherProps} tabIndex={0} role="button" />
	);
}