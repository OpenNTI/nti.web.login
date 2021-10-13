import path from 'path';

import { useState } from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';
import { getServer } from '@nti/web-client';
import { Loading } from '@nti/web-commons';
import { Page, PaddedContainer, Inputs } from 'internal/common';

import { Form, SuccessMessage, SentTo, Submit } from './Username';

const t = scoped('nti-login.recover.forgot.Password', {
	title: 'Forgot Password?',
	description:
		"Enter your account information and we'll help reset your password.",
	disabled: 'Resetting your password is not available at this time.',
	success: 'We sent a link to reset your password.',
	username: 'Username',
	email: 'Email',
	reset: 'Reset Password',
});

function getReturnURL(location) {
	const current = new URL(location.href);

	current.search = '';
	current.pathname = path.join(current.pathname, '../reset');

	return current.toString();
}

ForgotPassword.propTypes = {
	location: PropTypes.object,
	allowed: PropTypes.bool,
};
export default function ForgotPassword({ location, allowed }) {
	if (!allowed) {
		return <Page.Description description={t('disabled')} />;
	}

	const [sending, setSending] = useState(false);
	const [sentTo, setSentTo] = useState(null);

	const onSubmit = async ({ json }) => {
		setSending(true);

		try {
			const returnURL = getReturnURL(location);

			await getServer().recoverPassword(
				json.email,
				json.username,
				returnURL
			);

			setSentTo(json.email);
		} finally {
			setSending(false);
		}
	};

	return (
		<>
			{!sentTo && (
				<Page.Description
					subTitle={t('title')}
					description={t('description')}
				/>
			)}
			<PaddedContainer>
				{sending && <Loading.Spinner.Large />}
				{sentTo && (
					<div>
						<SuccessMessage>{t('success')}</SuccessMessage>
						<SentTo>{sentTo}</SentTo>
					</div>
				)}
				{!sentTo && (
					<Form sending={sending} onSubmit={onSubmit}>
						<Inputs.Text
							name="username"
							required
							label={t('username')}
							autoFocus
						/>
						<Inputs.Email
							name="email"
							required
							label={t('email')}
						/>
						<Submit data-testid="forgot-submit">
							{t('reset')}
						</Submit>
					</Form>
				)}
			</PaddedContainer>
		</>
	);
}
