import React from 'react';
import PropTypes from 'prop-types';
import {Theme} from '@nti/web-commons';

import Description from './Description';
import Background from './Background';
import Feature from './Feature';
import Content from './Content';

Page.Description = Description;
Page.propTypes = {
	scope: PropTypes.string
};
export default function Page ({scope, ...otherProps}) {
	return (
		<Theme.Scope scope={scope}>
			<Background>
				<Feature />
				<Content {...otherProps} />
			</Background>
		</Theme.Scope>
	);
}