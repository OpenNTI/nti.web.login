import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { Text } from '@nti/web-commons';

import styles from './index.css';

// don't mix input classnames with private classnames.
const _cx = cx.bind(styles);

function Factory(variant, tag) {
	WithClassName.propTypes = {
		className: PropTypes.string,
		right: PropTypes.bool,
		center: PropTypes.bool,
	};
	function WithClassName({ className, right, center, ...otherProps }) {
		return (
			<Text.Base
				className={cx(
					// as-is input class names here:
					className,
					// Repeat variant as clear-text so we may target it with client stylesheets.
					variant,
					// Private css module class names here:
					_cx(variant, 'text', { right, center })
				)}
				as={tag}
				{...otherProps}
			/>
		);
	}

	return WithClassName;
}

export default {
	Base: Factory(),
	H1: Factory('heading', 'h1'),
	SubTitle: Factory('sub-title', 'h6'),
	Disclaimer: Factory('disclaimer', 'h6'),
	Body: Factory('body', 'p'),
	Large: Factory('body-large', 'p'),
	Medium: Factory('body-medium', 'p'),
};
