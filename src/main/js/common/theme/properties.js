import {Theme} from '@nti/web-commons';

import Fallbacks from './fallback-assets';

const {buildTheme} = Theme;

export default {
	login: {
		featured: null,
		background: (_, globalTheme) => globalTheme.assets.background,
		logo: (_, globalTheme) => globalTheme.assets.fullLogo,
		title: 'Sup, Dawg!',
		description: 'We have everything you need to educate with confidence'
	},
	signup: {
		featured: null,
		background: (_, globalTheme) => globalTheme.assets.background,
		logo: (_, globalTheme) => globalTheme.assets.fullLogo,
		title: 'Create An Account',
		description: ''
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