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
	const [sentTo, setSentTo] = React.useState(null);

	const onValid = () => setDisabled(false);
	const onInvalid = () => setDisabled(true);

	const onSubmit = async ({json}) => {
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
			{!sentTo && (<Page.Description subTitle={t('title')} description={t('description')} />)}
			<PaddedContainer>
				{sending && (<Loading.Spinner.Large />)}
				{sentTo && (
					<div>
						<Text.Large className={cx('success-message')} center>{t('success')}</Text.Large>
						<Text.Body className={cx('sent-to')} center>{sentTo}</Text.Body>
					</div>
				)}
				{!sentTo && (
					<Form
						className={cx('forgot-form', {sending})}
						disabled={disabled}
						onValid={onValid}
						onInvalid={onInvalid}
						onSubmit={onSubmit}
					>
						<Inputs.Email name="email" placeholder={t('email')} autoFocus />
						<Button className={cx('submit')}as={Form.SubmitButton}>
							{t('reset')}
						</Button>
					</Form>
				)}
			</PaddedContainer>
		</>
	);
}