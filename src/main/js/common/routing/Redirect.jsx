import React from 'react';
import PropTypes from 'prop-types';
import {Redirect} from '@reach/router';

import {addReturnParam} from './util';

RoutingLink.propTypes = {
	to: PropTypes.string
};
export default function RoutingLink ({to, ...otherProps}) {
	return (
		<Redirect to={addReturnParam(to)} {...otherProps} />
	);
}