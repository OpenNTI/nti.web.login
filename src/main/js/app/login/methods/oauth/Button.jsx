import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {scoped} from '@nti/lib-locale';

import {Button} from '../../../../common';

import Styles from './Styles.css';
import Assets from './assets';

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
		background: '#ffffff',
		title: t('text.google'),
		theme: 'dark',
		icon: {
			src: Assets.Google,
			srcset: `${Assets.Google}, ${Assets.Google2x} 2x, ${Assets.Google3x} 3x`,
			alt: 'Google Logo'
		}
	},
	facebook: {
		background: '#0076FB',
		title: t('text.facebook'),
		theme: 'light',
		icon: {
			src: Assets.Facebook,
			srcset: `${Assets.Facebook}, ${Assets.Facebook2x} 2x, ${Assets.Facebook3x} 3x`,
			alt: 'Facebook Logo'
		}
	},
	linkedin: {
		background: '#2867B2',
		title: t('text.linkedin'),
		theme: 'light',
		icon: {
			src: Assets.LinkedIn,
			srcset: `${Assets.LinkedIn}, ${Assets.LinkedIn2x} 2x, ${Assets.LinkedIn3x} 3x`,
			alt: 'LinkedIn Logo'
		}
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
			className={cx('oauth-button', getServiceName(rel), {'has-icon': !!override.icon})}
			{...extraProps}
		>
			{override.icon && (<img {...override.icon} className={cx('button-icon')} />)}
			<span className={cx('button-label')}>{text}</span>
		</Button>
	);
}
