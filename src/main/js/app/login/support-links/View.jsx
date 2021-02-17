import React from 'react';
import { scoped } from '@nti/lib-locale';
import { List, Theme } from '@nti/web-commons';

import {
	getTermsLink,
	getSupportLink,
	getPrivacyLink,
	Cookies,
} from '../../../data';
import { Text } from '../../../common';

import FullLogo from './assets/full-logo.png';
import FullLogoX2 from './assets/full-logo@2x.png';
import FullLogoX3 from './assets/full-logo@3x.png';

const Container = styled.div`
	text-align: center;
`;

const Logo = styled.img`
	display: inline-block;
	max-width: 150px;
	height: auto;
`;

const Link = styled(Text.Body).attrs({ as: 'a' })`
	text-decoration: none;

	&:focus {
		text-decoration: underline;
	}
`;

const t = scoped('nti-login.login.support-links.View', {
	about: {
		title: 'About NextThought',
		label: 'About',
	},
	help: {
		title: 'Contact Support',
		label: 'Help',
	},
	terms: {
		title: 'NextThought Terms of Service and User Agreements',
		label: 'Terms',
	},
	privacy: {
		title: 'Learn about your privacy and NextThought',
		label: 'Privacy',
	},
	accessibility: {
		on: {
			label: 'Disable High Contrast',
			title: 'Disable high contrast styles in the platform.',
		},
		off: {
			label: 'Enable High Contrast',
			title: 'Enable high contrast styles in the platform.',
		},
	},
});

const ContrastCookie = 'use-accessibility-mode';

async function resolveLinks(update) {
	if (resolveLinks.cache) {
		return resolveLinks.cache;
	}

	const resolve = async () => {
		const support = await getSupportLink();
		const terms = await getTermsLink();
		const privacy = await getPrivacyLink();
		const contrast = Cookies.get(ContrastCookie) === 'true';

		const links = [
			{
				href: '//nextthought.com',
				title: t('about.title'),
				label: t('about.label'),
				target: '_blank',
			},
			support
				? {
						href: support,
						title: t('help.title'),
						label: t('help.label'),
						target: '_blank',
				  }
				: null,
			terms
				? {
						href: terms,
						title: t('terms.title'),
						label: t('terms.label'),
						target: '_blank',
				  }
				: null,
			privacy
				? {
						href: privacy,
						title: t('privacy.title'),
						label: t('privacy.label'),
						target: '_blank',
				  }
				: null,
			{
				href: '#',
				role: 'button',
				get title() {
					return contrast
						? t('accessibility.on.title')
						: t('accessibility.off.title');
				},
				get label() {
					return contrast
						? t('accessibility.on.label')
						: t('accessibility.off.label');
				},
				onClick: async e => {
					e.stopPropagation();
					e.preventDefault();

					Cookies.set(ContrastCookie, contrast ? 'false' : 'true');

					resolveLinks.cache = null;
					const updated = await resolveLinks(update);
					update(updated);
				},
			},
		];

		return links.filter(Boolean);
	};

	resolveLinks.cache = resolve();

	return resolveLinks.cache;
}

export default function SupportLinks() {
	const noBranding = Theme.useThemeProperty('noBranding');

	const [links, setLinks] = React.useState([]);

	React.useEffect(() => {
		const setup = async () => {
			try {
				const l = await resolveLinks(setLinks);

				if (l !== links) {
					setLinks(l);
				}
			} catch (e) {
				//swallow
			}
		};

		setup();
		return () => {};
	});

	return (
		<Container className="support-links">
			{!noBranding && (
				<Logo
					className="nt-logo"
					src={FullLogo}
					srcSet={`${FullLogo}, ${FullLogoX2} 2x, ${FullLogoX3} 3x`}
				/>
			)}
			<List.SeparatedInline>
				{links.map((l, key) => {
					const { label, ...otherProps } = l;
					return (
						<Link {...otherProps} key={key} className="footer-link">
							{label}
						</Link>
					);
				})}
			</List.SeparatedInline>
		</Container>
	);
}
