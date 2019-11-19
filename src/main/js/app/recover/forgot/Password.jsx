import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {scoped} from '@nti/lib-locale';
import {getServer} from '@nti/web-client';//eslint-disable-line
import {Form, Loading} from '@nti/web-commons';

import {Page, PaddedContainer, Inputs, Button, Text} from '../../../common';

import Styles from './Styles.css';

const cx = classnames.bind(Styles);
const t = scoped('nti-login.recover.forgot.Password', {
	title: 'Forgot Password?',
	description: 'Enter your account information and we\'ll help reset your password.',
	disabled: 'Resetting your password is not available at this time.',
	success: 'We sent a link to reset your password.',
	username: 'Username',
	email: 'Email',
	reset: 'Reset Password'
});

function getReturnURL (location) {
	const current = new URL(location.href);

	current.search = '';

	//TODO: do this better
	return `${current.toString().replace(/\/+$/)}/reset/`;

}

ForgotPassword.propTypes = {
	location: PropTypes.object,
	allowed: PropTypes.bool
};
export default function ForgotPassword ({location, allowed}) {
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
			const returnURL = getReturnURL(location);

			await getServer().recoverPassword(json.email, json.username, returnURL);

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
						<Inputs.Text name="username" placeholder={t('username')} />
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