import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './Styles.css';

const cx = classnames.bind(Styles);
	
PageContent.propTypes = {
	component: PropTypes.any,
	position: PropTypes.number
};
export default function PageContent ({component:Cmp, position, ...otherProps}) {
	return (
		<div className={cx('page-content', 'content')}>
			<Cmp {...otherProps} />
		</div>
	);
}