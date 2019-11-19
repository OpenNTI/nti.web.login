import {Theme} from '@nti/web-commons';

import Fallbacks from './fallback-assets';

const {buildTheme} = Theme;

export default {
	login: {
		featured: null,
		background: (_, globalTheme) => globalTheme.assets.background,
		logo: (_, globalTheme) => globalTheme.assets.logo,
		title: 'Howdy 🤠',
		subTitle: '',
		description: 'We have everything you need to educate with confidence',
		disclaimer: '',
		buttonText: 'Log In'
	},
	signup: {
		featured: null,
		background: (_, globalTheme) => globalTheme.assets.background,
		logo: (_, globalTheme) => globalTheme.assets.logo,
		title: '',
		subTitle: 'New Account',
		description: '',
		disclaimer: '',
		buttonText: 'Create my account!'
	},
	brandName: buildTheme.DefaultProperties.brandName,
	brandColor: buildTheme.DefaultProperties.brandColor,
	assets: {
		...buildTheme.DefaultProperties.assets,
		background: buildTheme.getAsset({
			alt: 'Background Image',
			href: Fallbacks.Background
		})
	}
};