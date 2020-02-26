import React from 'react';
import {Router} from '@reach/router';

import OAuth from './OAuth';
import AcceptInvitation from './AcceptInvitation';
import Disabled from './Disabled';

export default function View (props) {
	return (
		<Router>
			{/* <OAuth path="/" exact {...props} /> */}
			<AcceptInvitation path="signup" {...props}  />
			<Disabled path="disabled" {...props} />
		</Router>
	);
}
