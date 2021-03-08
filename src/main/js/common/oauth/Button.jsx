import React from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';

import ButtonBase from '../Button';

import Assets from './assets';

const getServiceName = rel => rel.split('.')[1].toLowerCase();
const t = scoped('nti-login.login.methods.oauth.Button', {
	text: {
		google: 'Sign In With Google',
		facebook: 'Sign In With Facebook',
		linkedin: 'Sign In With LinkedIn',
	},
});

const overrides = {
	google: {
		background: '#ffffff',
		title: t('text.google'),
		theme: 'dark',
		icon: {
			src: Assets.Google,
			srcset: `${Assets.Google}, ${Assets.Google2x} 2x, ${Assets.Google3x} 3x`,
			alt: 'Google Logo',
		},
	},
	facebook: {
		background: '#0076FB',
		title: t('text.facebook'),
		theme: 'light',
		icon: {
			src: Assets.Facebook,
			srcset: `${Assets.Facebook}, ${Assets.Facebook2x} 2x, ${Assets.Facebook3x} 3x`,
			alt: 'Facebook Logo',
		},
	},
	linkedin: {
		background: '#2867B2',
		title: t('text.linkedin'),
		theme: 'light',
		icon: {
			src: Assets.LinkedIn,
			srcset: `${Assets.LinkedIn}, ${Assets.LinkedIn2x} 2x, ${Assets.LinkedIn3x} 3x`,
			alt: 'LinkedIn Logo',
		},
	},
};

const Button = styled(ButtonBase).attrs({ as: 'a' })`
	position: relative;

	&.service-google {
		color: #757575;
	}

	&.has-icon {
		/* w? */
	}
`;

const Icon = styled.img`
	display: inline-block;
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	width: auto;
`;

OauthButton.propTypes = {
	link: PropTypes.shape({
		rel: PropTypes.string.isRequired,
		href: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
	}).isRequired,
	returnURL: PropTypes.string,
};
export default function OauthButton({ link, returnURL }) {
	const { rel, title, href } = link;

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
			href={url.toString()}
			className="oauth-button"
			service={getServiceName(rel)}
			has-icon={!!override.icon}
			{...extraProps}
		>
			{override.icon && (
				<Icon {...override.icon} className="button-icon" />
			)}
			<span className="button-label">{text}</span>
		</Button>
	);
}
