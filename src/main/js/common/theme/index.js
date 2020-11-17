import {Theme} from '@nti/web-commons';
import {getConfig} from '@nti/web-client';

import Properties from './properties';

let LoginTheme = null;

export {default as Properties} from './properties';

export function getTheme () {
	if (!LoginTheme) {
		LoginTheme = Theme.buildTheme(Properties);
		LoginTheme.setOverrides(Theme.siteBrandToTheme(getConfig('branding')));
	}

	return LoginTheme;
}
