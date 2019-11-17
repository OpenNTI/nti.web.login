import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Theme} from '@nti/web-commons';

import Text from '../text';
import PaddedContainer from '../PaddedContainer';

import Styles from './Styles.css';

const cx = classnames.bind(Styles);

Description.propTypes = {
	className: PropTypes.string
};
export default function Description ({className, ...otherProps}) {
	const title = Theme.useThemeProperty('title');
	const subTitle = Theme.useThemeProperty('subTitle');
	const description = Theme.useThemeProperty('description');

	return (
		<PaddedContainer className={cx('description', className, {'has-subtitle': !!subTitle})}>
			{title && (<Text.H1>{title}</Text.H1>)}
			{description && (<Text.Large>{description}</Text.Large>)}
			{subTitle && (<Text.SubTitle>{subTitle}</Text.SubTitle>)}
		</PaddedContainer>
	);
}