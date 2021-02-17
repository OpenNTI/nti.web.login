import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';
import { getServer } from '@nti/web-client';
import { Form as FormBase, Loading } from '@nti/web-commons';

import { Page, PaddedContainer, Inputs, Button, Text } from '../../../common';

const t = scoped('nti-login.recover.forgot.Username', {
	title: 'Forgot Username?',
	description: "Enter your email and we'll send your username.",
	disabled: 'Recovering your username is not available at this time.',
	success: 'We sent your username to your email address.',
	email: 'Email',
	reset: 'Send Username',
});

export const Form = styled(FormBase).attrs({ className: 'forgot-form' })`
	&.sending {
		display: none;
	}
`;

export const SuccessMessage = styled(Text.Large).attrs({
	className: 'success-message',
	center: true,
})`
	padding: 0 2.5rem;
`;

export const SentTo = styled(Text.Body).attrs({ center: true })`
	margin-top: 1.5rem;
`;

export const Submit = styled(Button).attrs({
	as: FormBase.SubmitButton,
	className: 'submit',
})`
	margin-top: 2.25rem;
`;

ForgotUsername.propTypes = {
	allowed: PropTypes.bool,
};
export default function ForgotUsername({ allowed }) {
	if (!allowed) {
		return <Page.Description description={t('disabled')} />;
	}

	const [sending, setSending] = React.useState(false);
	const [sentTo, setSentTo] = React.useState(null);

	const onSubmit = async ({ json }) => {
		setSending(true);

		try {
			await getServer().recoverUsername(json.email);

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
						<Inputs.Email
							required
							name="email"
							label={t('email')}
							autoFocus
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
