import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './Styles.css';

const cx = classnames.bind(Styles);

PageBody.propTypes = {
	className: PropTypes.string
};
export default function PageBody ({className, ...otherProps}) {
	return (
		<section className={cx('page-body', className)} {...otherProps} />
	);
}