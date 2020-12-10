import React from 'react';
import ReactDOM from 'react-dom';
import {addFeatureCheckClasses} from '@nti/lib-dom';
import {init as initLocale} from '@nti/lib-locale';

import App from './app';

addFeatureCheckClasses();
initLocale();

if (window.top === window) {
	window.top.location.replace(window.location);
}

function onAppMount (APP) {
	global.appInitialized = !!APP;
}

ReactDOM.render(
	React.createElement(App, {ref: onAppMount}),
	document.getElementById('content')
);
