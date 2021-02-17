import React from 'react';
import PropTypes from 'prop-types';
import { Errors } from '@nti/web-commons';

SignupUnavailable.propTypes = {
	error: PropTypes.any,
};
export default function SignupUnavailable({ error }) {
	return <Errors.Message error={error} />;
}
