import React from 'react';
import ReactDOM from 'react-dom';
import {addFeatureCheckClasses} from '@nti/lib-dom';

import App from './app';

addFeatureCheckClasses();

function onAppMount (APP) {
	global.appInitialized = !!APP;
}

ReactDOM.render(
	React.createElement(App, {ref: onAppMount}),
	document.getElementById('content')
);