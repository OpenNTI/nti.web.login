import React from 'react';
import PropTypes from 'prop-types';
import { Theme } from '@nti/web-commons';

import Description from './Description';
import Background from './Background';
import Feature from './Feature';
import Main from './Main';
import Content from './parts/Content';
import Footer from './parts/Footer';
import Header from './parts/Header';
import Body from './parts/Body';

Page.Content = Content;
Page.Body = Body;
Page.Header = Header;
Page.Footer = Footer;
Page.Description = Description;
Page.propTypes = {
	scope: PropTypes.string,
};
export default function Page({ scope, ...otherProps }) {
	return (
		<Theme.Scope scope={scope}>
			<Background>
				<Feature />
				<Main {...otherProps} />
			</Background>
		</Theme.Scope>
	);
}
