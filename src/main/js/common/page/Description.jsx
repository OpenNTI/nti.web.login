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
export default function Description ({className, description, disclaimer, subTitle, title}) {
	const tTitle = Theme.useThemeProperty('title');
	const tSubTitle = Theme.useThemeProperty('subTitle');
	const tDescription = Theme.useThemeProperty('description');
	const tDisclaimer = Theme.useThemeProperty('disclaimer');

	const lines = [
		[ title || tTitle, Text.H1 ],
		[ subTitle || tSubTitle, Text.SubTitle ],
		[ description || tDescription, Text.Large ],
		[ disclaimer || tDisclaimer, Text.Disclaimer ]
	];

	return (
		<Container className={className} has-subTitle={!!subTitle} no-title={!title}>
			{lines.filter(([x]) => x).map(([text, Cmp]) => (
				<Cmp key={text}>{text}</Cmp>
			))}
		</Container>
	);
}

