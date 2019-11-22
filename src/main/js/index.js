import React from 'react';
import ReactDOM from 'react-dom';
import {addFeatureCheckClasses} from '@nti/lib-dom';

import App from './app';

addFeatureCheckClasses();

ReactDOM.render(
	React.createElement(App),
	document.getElementById('content')
);