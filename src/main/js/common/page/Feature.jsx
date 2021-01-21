import React from 'react';
import {Theme} from '@nti/web-commons';

const Feature = styled('div')`
	position: fixed;
	top: 0;
	left: 0;
	right: 500px;
	bottom: 0;
	display: flex;
	align-items: center;
	justify-content: center;

	img {
		max-width: 100%;
		height: auto;

		@supports (object-fit: contain) {
			max-width: 100%;
			max-height: 100%;
			object-fit: contain;
		}
	}

	@media (max-width: 1000px) {
		display: none;
	}
`;

export default function PageFeature () {
	return (
		<Feature className="page-feature">
			<Theme.Asset name="featured" />
		</Feature>
	);
}
