import {Theme} from '@nti/web-commons';
import {Color} from '@nti/lib-commons';

import Fallbacks from './fallback-assets';

const {buildTheme} = Theme;

export default {
	login: {
		featured: (_, globalTheme) => globalTheme.assets['login_featured_callout'],
		background: (_, globalTheme) => globalTheme.assets['login_background'],
		logo: (_, globalTheme) => globalTheme.assets['login_logo'],
		title: 'Howdy!',
		subTitle: '',
		description: 'We have everything you need to educate with confidence.',
		disclaimer: '',
		buttonText: 'Sign In',
		buttonBackground: '#3fb34f',
		buttonTheme: (values) => {
			const color = Color(values.buttonBackground);
			const isReadable = color.a11y.isReadable('#fff', {'level': 'AA', 'size': 'large'});

			return isReadable ? 'light' : 'dark';
		}
	},
	signup: {
		featured: (_, globalTheme) => globalTheme.assets['login_featured_callout'],
		background: (_, globalTheme) => globalTheme.assets['login_background'],
		logo: (_, globalTheme) => globalTheme.assets['login_logo'],
		title: '',
		subTitle: 'New Account',
		description: '',
		disclaimer: '',
		buttonText: 'Create my account!',
		buttonBackground: (_, globalTheme) => globalTheme.login.buttonBackground,
		buttonTheme: (_, globalTheme) => globalTheme.login.buttonTheme
	},
	recover: {
		featured: (_, globalTheme) => globalTheme.assets['login_featured_callout'],
		background: (_, globalTheme) => globalTheme.assets['login_background'],
		logo: (_, globalTheme) => globalTheme.assets['login_logo'],
		buttonBackground: (_, globalTheme) => globalTheme.login.buttonBackground,
		buttonTheme: (_, globalTheme) => globalTheme.login.buttonTheme
	},
	brandName: buildTheme.DefaultProperties.brandName,
	brandColor: buildTheme.DefaultProperties.brandColor,
	assets: {
		...buildTheme.DefaultProperties.assets,
		'login_logo': buildTheme.getAsset({
			alt: 'Logo',
			fallback: Fallbacks.LoginLogo,
			href: Fallbacks.LoginLogo
		}),
		'login_background': buildTheme.getAsset({
			alt: 'Background Image',
			fallback: Fallbacks.Background,
			href: Fallbacks.Background
		}),
		'login_featured_callout': buildTheme.getAsset({
			alt: 'Feautred',
			href: null
		})
	}
};