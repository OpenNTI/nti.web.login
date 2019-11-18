import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
	
//TODO: add a transition between components

import Styles from './Styles.css';

const cx = classnames.bind(Styles);

PageMain.propTypes = {
	component: PropTypes.any,
	position: PropTypes.number
};
export default function PageMain ({component:Cmp, position, ...otherProps}) {
	return (
		<div className={cx('main')}>
			<Cmp {...otherProps} />
		</div>
	);
}