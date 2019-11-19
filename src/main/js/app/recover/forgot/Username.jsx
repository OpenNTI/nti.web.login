import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {scoped} from '@nti/lib-locale';
import {getServer} from '@nti/web-client';//eslint-disable-line
import {Form, Loading} from '@nti/web-commons';

import {Page, PaddedContainer, Inputs, Button, Text} from '../../../common';

import Styles from './Styles.css';

const cx = classnames.bind(Styles);
const t = scoped('nti-login.recover.forgot.Username', {
	title: 'Forgot Username?',
	description: 'Enter your email and we\'ll send your username.',
	disabled: 'Recovering your username is not available at this time.',
	success: 'We sent your username to your email address.',
	email: 'Email',
	reset: 'Send Username'
});


ForgotUsername.propTypes = {
	allowed: PropTypes.bool
};
export default function ForgotUsername ({allowed}) {
	if (!allowed) {
		return (
			<Page.Description description={t('disabled')} />
		);
	}

	const [disabled, setDisabled] = React.useState(true);
	const [sending, setSending] = React.useState(false);
	const [sent, setSent] = React.useState(false);

	const onValid = () => setDisabled(false);
	const onInvalid = () => setDisabled(true);

	const onSubmit = async ({json}) => {
		setSending(true);

		try {

			await getServer().recoverUsername(json.email);

			setSent(true);
		} finally {
			setSending(false);
		}
	};

	return (
		<>
			<Page.Description subTitle={t('title')} description={t('description')} />
			<PaddedContainer>
				{sending && (<Loading.Spinner.Large />)}
				{sent && (
					<Text.Medium>{t('success')}</Text.Medium>
				)}
				{!sent && (
					<Form
						className={cx('forgot-form', {sending})}
						disabled={disabled}
						onValid={onValid}
						onInvalid={onInvalid}
						onSubmit={onSubmit}
					>
						<Inputs.Email name="email" placeholder={t('email')} />
						<Button className={cx('submit')}as={Form.SubmitButton}>
							{t('reset')}
						</Button>
					</Form>
				)}
			</PaddedContainer>
		</>
	);
}