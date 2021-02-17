import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';
import { Form as FormBase, Loading } from '@nti/web-commons';

import { Text, Inputs, Button, Routing } from '../../../common';

const Form = styled(FormBase)`
	&.busy {
		display: none;
	}
`;

const Submit = styled(Button).attrs({
	as: FormBase.SubmitButton,
	className: 'submit-button',
})`
	margin-top: 2.25rem;
`;

import Store from './Store';

const successRedirectDelay = 1000;

const t = scoped('nti-login.recover.reset.Form', {
	disabled: 'Resetting your password is not available at this time.',
	username: 'Username',
	code: 'Code',
	password: 'Password',
	verifyPassword: 'Verify Password',
	save: 'Save Password',
});

ResetPasswordForm.propTypes = {
	canResetPassword: PropTypes.bool,
	resetPassword: PropTypes.func,
	paramValues: PropTypes.object,
	returnURL: PropTypes.string,
};
function ResetPasswordForm({
	canResetPassword,
	resetPassword,
	paramValues,
	returnURL,
}) {
	if (!canResetPassword) {
		return <Text.Medium>{t('disabled')}</Text.Medium>;
	}

	const [busy, setBusy] = React.useState(false);
	const [sent, setSent] = React.useState(false);

	const onSubmit = async ({ formData, json }) => {
		setBusy(true);

		try {
			await resetPassword(formData, json);
			setSent(true);

			setTimeout(() => {
				global.location?.replace(returnURL);
			}, successRedirectDelay);
		} finally {
			setBusy(false);
		}
	};

	return (
		<>
			{busy && <Loading.Spinner.Large />}
			{sent && (
				<Text.Medium>
					Password reset successful!{' '}
					<Routing.Link to={returnURL}>Log in.</Routing.Link>
				</Text.Medium>
			)}
			{!sent && (
				<Form onSubmit={onSubmit} className="reset-form" busy={busy}>
					{paramValues.username && (
						<Inputs.Hidden
							name="username"
							value={paramValues.username}
						/>
					)}
					{paramValues.id && (
						<Inputs.Hidden name="id" value={paramValues.id} />
					)}
					{!paramValues.username && (
						<Inputs.Text
							name="username"
							label={t('username')}
							required
						/>
					)}
					{!paramValues.id && (
						<Inputs.Text name="id" label={t('code')} required />
					)}
					<Inputs.Password
						name="password"
						label={t('password')}
						required
					/>
					<Inputs.Password
						name="password2"
						label={t('verifyPassword')}
						required
					/>
					<Submit data-testid="reset-submit">{t('save')}</Submit>
				</Form>
			)}
		</>
	);
}

export default Store.monitor({
	[Store.CanResetPassword]: 'canResetPassword',
	[Store.ResetPassword]: 'resetPassword',
	[Store.ParamValues]: 'paramValues',
	[Store.ReturnURL]: 'returnURL',
})(ResetPasswordForm);
