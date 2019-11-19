import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Theme} from '@nti/web-commons';

import Text from '../text';
import PaddedContainer from '../PaddedContainer';

import Styles from './Styles.css';

const cx = classnames.bind(Styles);

Description.propTypes = {
	className: PropTypes.string,
	title: PropTypes.string,
	subTitle: PropTypes.string,
	description: PropTypes.string,
	disclaimer: PropTypes.string
};
export default function Description (props) {
	const {className} = props;
	const title = props.title || Theme.useThemeProperty('title');
	const subTitle = props.subTitle || Theme.useThemeProperty('subTitle');
	const description = props.description || Theme.useThemeProperty('description');
	const disclaimer = props.disclaimer || Theme.useThemeProperty('disclaimer');

	return (
		<PaddedContainer className={cx('description', className, {'has-disclaimer': !!disclaimer, 'no-title': !title})}>
			{title && (<Text.H1>{title}</Text.H1>)}
			{subTitle && (<Text.SubTitle>{subTitle}</Text.SubTitle>)}
			{description && (<Text.Large>{description}</Text.Large>)}
			{disclaimer && (<Text.Disclaimer>{disclaimer}</Text.Disclaimer>)}
		</PaddedContainer>
	);
}