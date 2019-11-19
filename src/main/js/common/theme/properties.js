import {Theme} from '@nti/web-commons';

import Fallbacks from './fallback-assets';

const {buildTheme} = Theme;

export default {
	login: {
		featured: null,
		background: (_, globalTheme) => globalTheme.assets.background,
		logo: (_, globalTheme) => globalTheme.assets.loginLogo,
		title: 'Howdy 🤠',
		subTitle: '',
		description: 'We have everything you need to educate with confidence',
		disclaimer: '',
		buttonText: 'Log In'
	},
	signup: {
		featured: null,
		background: (_, globalTheme) => globalTheme.assets.background,
		logo: (_, globalTheme) => globalTheme.assets.loginLogo,
		title: '',
		subTitle: 'New Account',
		description: '',
		disclaimer: '',
		buttonText: 'Create my account!'
	},
	recover: {
		featured: null,
		background: (_, globalTheme) => globalTheme.assets.background,
		logo: (_, globalTheme) => globalTheme.assets.loginLogo
	},
	brandName: buildTheme.DefaultProperties.brandName,
	brandColor: buildTheme.DefaultProperties.brandColor,
	assets: {
		...buildTheme.DefaultProperties.assets,
		loginLogo: buildTheme.getAsset({
			alt: 'Logo',
			fallback: Fallbacks.LoginLogo,
			href: Fallbacks.LoginLogo
		}),
		background: buildTheme.getAsset({
			alt: 'Background Image',
			href: Fallbacks.Background
		})
	}
};