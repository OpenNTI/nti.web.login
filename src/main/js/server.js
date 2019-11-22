import React from 'react';
import ReactSSR from 'react-dom/server';
import { ServerLocation } from '@reach/router';

import App from './app';

export default async (url) => {
	return ReactSSR.renderToString(
		<ServerLocation url={url}>
			<App />
		</ServerLocation>
	);
};