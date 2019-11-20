import {Theme} from '@nti/web-commons';
import {getConfigFor} from '@nti/web-client';//eslint-disable-line

import Properties from './properties';

let LoginTheme = null;

export Properties from './properties';

export function getTheme () {
	if (!LoginTheme) {
		LoginTheme = Theme.buildTheme(Properties);
		LoginTheme.setOverrides(Theme.siteBrandToTheme(getConfigFor('branding')));
	}

	return LoginTheme;
}