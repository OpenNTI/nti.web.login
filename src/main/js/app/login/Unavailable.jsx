import React from 'react';
import PropTypes from 'prop-types';

import { Errors } from '@nti/web-commons';

LoginUnavailable.propTypes = {
	error: PropTypes.any,
};
export default function LoginUnavailable({ error }) {
	return <Errors.Message error={error} />;
}
