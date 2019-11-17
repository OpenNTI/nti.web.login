import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './PaddedContainer.css';

const cx = classnames.bind(Styles);

PaddedContainer.propTypes = {
	as: PropTypes.string,
	className: PropTypes.string
};
export default function PaddedContainer ({as: tag, className, ...otherProps}) {
	const Cmp = tag || 'div';

	return (
		<Cmp className={cx('padded-container', className)} {...otherProps} />
	);
}