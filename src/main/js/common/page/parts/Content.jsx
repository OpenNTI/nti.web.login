import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './Styles.css';

const cx = classnames.bind(Styles);

PageContent.propTypes = {
	className: PropTypes.string
};
export default function PageContent ({className, ...otherProps}) {
	return (
		<article className={cx('page-content', className)} {...otherProps} />
	);
}