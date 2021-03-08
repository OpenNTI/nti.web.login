import React from 'react';
import ReactDOM from 'react-dom';

import { addFeatureCheckClasses } from '@nti/lib-dom';
import { init as initLocale } from '@nti/lib-locale';
import { initErrorReporter } from '@nti/web-client';

import App from './app';

initLocale();

function onAppMount(APP) {
	global.appInitialized = !!APP;
}

if (typeof document !== 'undefined') {
	initErrorReporter();
	addFeatureCheckClasses();

	ReactDOM.render(
		React.createElement(App, { ref: onAppMount }),
		document.getElementById('content')
	);
}
