import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Link} from '@reach/router';
import {scoped} from '@nti/lib-locale';
import {Form, Loading} from '@nti/web-commons';

import {Text, Inputs, Button} from '../../../common';

import Store from './Store';
import Styles from './Styles.css';

const successRedirectDelay = 1000;

const cx = classnames.bind(Styles);
const t = scoped('nti-login.recover.reset.Form', {
	disabled: 'Resetting your password is not available at this time.',
	username: 'Username',
	code: 'Code',
	password: 'Password',
	verifyPassword: 'Verify Password',
	save: 'Save Password'
});

ResetPasswordForm.propTypes = {
	canResetPassword: PropTypes.bool,
	resetPassword: PropTypes.func,
	paramValues: PropTypes.object,
	returnURL: PropTypes.string
};
function ResetPasswordForm ({canResetPassword, resetPassword, paramValues, returnURL}) {
	if (!canResetPassword) { return (<Text.Medium>{t('disabled')}</Text.Medium>); }

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
			{busy && (<Loading.Spinner.Large />)}
			{sent && (
				<Text.Medium>
					Password reset successful! <Link to={returnURL}>Log in.</Link>
				</Text.Medium>
			)}
			{!sent && (
				<Form onSubmit={onSubmit} className={cx('reset-form', {busy})}>
					{paramValues.username && (<Inputs.Hidden name="username" value={paramValues.username} />)}
					{paramValues.id && (<Inputs.Hidden name="id" value={paramValues.id} />)}
					{!paramValues.username && (<Inputs.Text name="username" placeholder={t('username')} required />)}
					{!paramValues.id && (<Inputs.Text name="id" placeholder={t('code')} required />)}
					<Inputs.Password name="password" placeholder={t('password')} required />
					<Inputs.Password name="password2" placeholder={t('verifyPassword')} required />
					<Button as={Form.SubmitButton} className={cx('submit-button')}>
						{t('save')}
					</Button>
				</Form>
			)}
		</>
	);
}

export default Store
	.monitor({
		[Store.CanResetPassword]: 'canResetPassword',
		[Store.ResetPassword]: 'resetPassword',
		[Store.ParamValues]: 'paramValues',
		[Store.ReturnURL]: 'returnURL'
	})(ResetPasswordForm);
