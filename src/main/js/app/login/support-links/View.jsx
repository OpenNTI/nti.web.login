import React from 'react';
import classnames from 'classnames/bind';
import {scoped} from '@nti/lib-locale';
import {List} from '@nti/web-commons';

import {getTermsLink, getSupportLink, getPrivacyLink} from '../../../data';
import {Text} from '../../../common';

import Styles from './Styles.css';
import FullLogo from './assets/full-logo.png';
import FullLogox2 from './assets/full-logo@2x.png';
import FullLogox3 from './assets/full-logo@3x.png';

const cx = classnames.bind(Styles);
const t = scoped('nti-login.login.support-links.View', {
	about: {
		title: 'About NextThought',
		label: 'About'
	},
	help: {
		title: 'Contact Support',
		label: 'Help'
	},
	terms: {
		title: 'NextThought Terms of Service and User Agreements',
		label: 'Terms'
	},
	privacy: {
		title: 'Learn about your privacy and NextThought',
		label: 'Privacy'
	}
});

let resolvedLinks = null;

async function resolveLinks () {
	if (resolvedLinks) { return resolvedLinks; }

	const support = await getSupportLink();
	const terms = await getTermsLink();
	const privacy = await getPrivacyLink();

	const links = [
		{href: '//nextthought.com', title: t('about.title'), label: t('about.label'), target: '_blank'},
		support ? ({href: support, title: t('help.title'), label: t('help.label'), target: '_blank'}) : null,
		terms ? ({href: terms, title: t('terms.title'), label: t('terms.label'), target: '_blank'}) : null,
		privacy ? ({href: privacy, title: t('privacy.title'), label: t('privacy.label'), target: '_blank'}) : null
	];

	resolvedLinks = links.filter(Boolean);

	return resolvedLinks;
}

export default function SupportLinks () {
	const [links, setLinks] = React.useState([]);

	React.useEffect(() => {
		const setup = async () => {
			try {
				const l = await resolveLinks();

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
		<div className={cx('support-links')}>
			<img
				className={cx('nt-logo')}
				src={FullLogo}
				srcSet={`${FullLogo}, ${FullLogox2} x2, ${FullLogox3} 3x`}
			/>
			<List.SeparatedInline>
				{links.map((l, key) => {
					const {label, ...otherProps} = l;
					return (
						<Text.Body as="a" {...otherProps} key={key} className={cx('footer-link')}>
							{label}
						</Text.Body>
					);
				})}
			</List.SeparatedInline>
		</div>
	);
}