import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Text} from '@nti/web-commons';

import Styles from './Styles.css';

const cx = classnames.bind(Styles);

function Factory (variant, tag) {
	WithClassName.propTypes = {
		className: PropTypes.string,
		right: PropTypes.bool
	};
	function WithClassName ({className, right, ...otherProps}) {
		return (
			<Text.Base className={cx(className, variant, 'text', {right})} as={tag} {...otherProps} />
		);
	}

	return WithClassName;
}

export default {
	Base: Factory(),
	H1: Factory('heading', 'h1'),
	SubTitle: Factory('sub-title', 'h6'),
	Body: Factory('body', 'p'),
	Large: Factory('body-large', 'p')
};