import {Theme} from '@nti/web-commons';
import {Color} from '@nti/lib-commons';

import Fallbacks from './fallback-assets';

const {buildTheme} = Theme;

export default {
	login: {
		featured: (values, globalTheme) => values.noFeature ? null : globalTheme.assets['login_featured_callout'],
		background: (_, globalTheme) => globalTheme.assets['login_background'],
		logo: (values, globalTheme) => values.noLogo ? null : globalTheme.assets['login_logo'],
		noLogo: false,
		noFeature: false,
		title: 'Hello!',
		subTitle: '',
		description: 'We have everything you need to educate with confidence.',
		disclaimer: '',
		buttonText: 'Sign In',
		buttonBackground: '#3fb34f',
		buttonTheme: (values) => {
			const color = Color(values.buttonBackground);
			const readability = color.a11y.readability('#fff');

			return readability > 2.3 ? 'light' : 'dark';
		},
		noBranding: (_, globalTheme) => globalTheme.HideNextThoughtBranding
	},
	signup: {
		featured: (_, globalTheme) => globalTheme.login.featured,
		background: (_, globalTheme) => globalTheme.login.background,
		logo: (_, globalTheme) => globalTheme.login.logo,
		title: '',
		subTitle: 'New Account',
		description: '',
		disclaimer: '',
		buttonText: 'Create my account!',
		buttonBackground: (_, globalTheme) => globalTheme.login.buttonBackground,
		buttonTheme: (_, globalTheme) => globalTheme.login.buttonTheme,
		noBranding: (_, globalTheme) => globalTheme.login.noBranding
	},
	accountSetup: {
		featured: (_, globalTheme) => globalTheme.login.featured,
		background: (_, globalTheme) => globalTheme.login.background,
		logo: (_, globalTheme) => globalTheme.login.logo,
		title: '',
		subTitle: 'Complete Your Account',
		description: '',
		disclaimer: '',
		buttonText: 'Go to My Site',
		buttonBackground: (_, globalTheme) => globalTheme.login.buttonBackground,
		buttonTheme: (_, globalTheme) => globalTheme.login.buttonTheme,
		noBranding: (_, globalTheme) => globalTheme.login.noBranding
	},
	recover: {
		featured: (_, globalTheme) => globalTheme.login.featured,
		background: (_, globalTheme) => globalTheme.login.background,
		logo: (_, globalTheme) => globalTheme.login.logo,
		buttonBackground: (_, globalTheme) => globalTheme.login.buttonBackground,
		buttonTheme: (_, globalTheme) => globalTheme.login.buttonTheme,
		noBranding: (_, globalTheme) => globalTheme.login.noBranding
	},
	brandName: buildTheme.DefaultProperties.brandName,
	brandColor: buildTheme.DefaultProperties.brandColor,
	HideNextThoughtBranding: false,
	assets: {
		...buildTheme.DefaultProperties.assets,
		'login_logo': buildTheme.getAsset({
			alt: (_, globalTheme) => `${globalTheme.brandName} Logo`,
			fallback: Fallbacks.LoginLogo,
			href: Fallbacks.LoginLogo
		}),
		'login_background': buildTheme.getAsset({
			alt: '',
			fallback: Fallbacks.Background,
			href: Fallbacks.Background
		}),
		'login_featured_callout': buildTheme.getAsset({
			alt: '',
			href: Fallbacks.Feature
		})
	}
};
