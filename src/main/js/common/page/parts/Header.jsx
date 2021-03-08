import React from 'react';

import { Theme } from '@nti/web-commons';

import { mergeClassName as add } from '../../utils';

const Header = styled('section').attrs(add('page-header'))`
	flex: 0 0 auto;
	width: 100%;
	text-align: center;
	height: 110px;
	padding-top: 0.625rem;

	img {
		display: inline-block;
		max-height: 100px;
		width: auto;

		@supports (object-fit: contain) {
			max-width: 100%;
			max-height: 100%;
			object-fit: contain;
		}
	}

	@media (max-width: 600px) {
		height: 80px;
	}
`;

export default function PageHeader() {
	return (
		<Header>
			<Theme.Asset name="logo" />
		</Header>
	);
}
