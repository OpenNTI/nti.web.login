import React from 'react';
import PropTypes from 'prop-types';
import {Theme} from '@nti/web-commons';

import Text from '../text';
import PaddedContainer from '../PaddedContainer';

const Container = styled(PaddedContainer)`
	margin-bottom: 1.75rem;
	padding-bottom: 2rem;

	&.no-title,
	&.has-subTitle {
		padding-bottom: 0;
	}

	@media (max-width: 600px) {
		padding-bottom: 0;
	}
`;

Description.propTypes = {
	className: PropTypes.string,
	title: PropTypes.string,
	subTitle: PropTypes.string,
	description: PropTypes.string,
	disclaimer: PropTypes.string
};
export default function Description (props) {
	const {className} = props;
	const tTitle = Theme.useThemeProperty('title');
	const tSubTitle = Theme.useThemeProperty('subTitle');
	const tDescription = Theme.useThemeProperty('description');
	const tDisclaimer = Theme.useThemeProperty('disclaimer');

	const title = props.title || tTitle;
	const subTitle = props.subTitle || tSubTitle;
	const description = props.description || tDescription;
	const disclaimer = props.disclaimer || tDisclaimer;

	return (
		<Container className={className} has-subTitle={!!subTitle} no-title={!title}>
			{title && (<Text.H1>{title}</Text.H1>)}
			{subTitle && (<Text.SubTitle>{subTitle}</Text.SubTitle>)}
			{description && (<Text.Large>{description}</Text.Large>)}
			{disclaimer && (<Text.Disclaimer>{disclaimer}</Text.Disclaimer>)}
		</Container>
	);
}

