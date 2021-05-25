import { useEffect } from 'react';
import { navigate, globalHistory } from '@reach/router';

import { AnonymousPage as AnonymousCatalog } from '@nti/web-catalog';
import { getHistory } from '@nti/web-routing';

export function Catalog(props) {
	useEffect(() => {
		const history = getHistory();
		const unsubHistory = history.listen(({ pathname, state }) => {
			if (globalHistory.location?.pathname !== pathname) {
				navigate(pathname, { replace: true });
			}
		});
		const unsubGlobal = globalHistory.listen(({ action, location }) => {
			if (location.pathname !== history.pathname) {
				history.replace(location.pathname);
			}
		});
		return (...args) => {
			unsubHistory(...args);
			unsubGlobal(...args);
		};
	});

	return <AnonymousCatalog {...props} />;
}
