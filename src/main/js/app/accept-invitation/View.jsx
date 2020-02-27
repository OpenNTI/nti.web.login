import React from 'react';
import {Router} from '@reach/router';

import OAuth from './OAuth';
import AcceptInvitation from './AcceptInvitation';
import Disabled from './Disabled';

export default function View (props) {
	return (
		<>
			<AcceptInvitation path="signup" {...props}  />
			<Disabled path="disabled" {...props} />
			<OAuth path="/" exact {...props} />
		</>
	);
}
