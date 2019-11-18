import React from 'react';
import PropTypes from 'prop-types';
import {Form} from '@nti/web-commons';

import {Inputs} from '../../common';

import Store from './Store';

SignupForm.propTypes = {
	checkUsername: PropTypes.func
};
function SignupForm ({checkUsername}) {
	const [disabled, setDisabled] = React.useState(true);

	const onValid = () => setDisabled(false);
	const onInvalid = () => setDisabled(true);

	const onChange = ({json}) => {
		const {Username: username} = json || {};

		return checkUsername(username);
	};

	return (
		<Form disabled={disabled} onValid={onValid} onInvalid={onInvalid} onChange={onChange}>
			<Inputs.Text required name="first" placeholder="First Name" />
			<Inputs.Text required name="last" placeholder="Last Name" />
			<Inputs.Email required name="email" placeholder="Email" />
			<Inputs.Text required name="Username" placeholder="Username" />
			<Inputs.Password required name="password" placeholder="Password"/>
			<Inputs.Password required name="password2" placeholder=" Confirm Password" />
			<Inputs.Checkbox required name="opt_in_email_communication" label="Send me email updates." />
		</Form>
	);
}

export default Store
	.monitor({
		[Store.CheckUsername]: 'checkUsername'
	})(SignupForm);