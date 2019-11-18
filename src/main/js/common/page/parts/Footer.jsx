import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './Styles.css';

const cx = classnames.bind(Styles);

PageFooter.propTypes = {
	className: PropTypes.string
};
export default function PageFooter ({className, ...otherProps}) {
	return (
		<section className={cx('page-footer', className)} {...otherProps} />
	);
}