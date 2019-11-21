import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {scoped} from '@nti/lib-locale';

import {Button} from '../../../../common';

import Styles from './Styles.css';

const cx = classnames.bind(Styles);
const getServiceName = rel => rel.split('.')[1].toLowerCase();
const t = scoped('nti-login.login.methods.oauth.Button', {
	text: {
		google: 'Sign In With Google',
		facebook: 'Sign In With Facebook',
		linkedin: 'Sign In With LinkedIn'
	}
});

const overrides = {
	google: {
		background: '#c94b36',
		title: t('text.google'),
		theme: 'light'
	},
	facebook: {
		background: '#4469a5',
		title: t('text.facebook'),
		theme: 'light'
	},
	linkedin: {
		background: '#0085ae',
		title: t('text.linkedin'),
		theme: 'light'
	}
};


OauthButton.propTypes = {
	link: PropTypes.shape({
		rel: PropTypes.string.isRequired,
		href: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired
	}).isRequired,
	returnURL: PropTypes.string
};
export default function OauthButton ({link, returnURL}) {
	const {rel, title, href} = link;

	const base = global.location;
	const url = new URL(href, base);

	url.searchParams.set('success', returnURL || base);
	url.searchParams.set('failure', base);

	const service = getServiceName(rel);

	const override = overrides[service] || {};
	const text = override.title || title || service;

	const extraProps = {};

	if (override.background) {
		extraProps.background = override.background;
	}

	if (override.theme) {
		extraProps.theme = override.theme;
	}

	return (
		<Button
			as="a"
			href={url.toString()}
			className={cx('oauth-button', getServiceName(rel))}
			{...extraProps}
		>
			{text}
		</Button>
	);
}
