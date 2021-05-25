import { useEffect } from 'react';
import { navigate, globalHistory, useLocation } from '@reach/router';

import { AnonymousPage as AnonymousCatalog } from '@nti/web-catalog';
import { getHistory } from '@nti/web-routing';

const webRoutingHistory = getHistory();

export function Catalog(props) {
	const location = useLocation();

	useEffect(() => {
		return webRoutingHistory.listen(({ pathname, state }) => {
			if (globalHistory.location?.pathname !== pathname) {
				navigate(pathname, { replace: true });
			}
		});
	}, []);

	useEffect(() => {
		if (location.pathname !== webRoutingHistory.pathname) {
			webRoutingHistory.replace(location.pathname);
		}
	}, [location.pathname]);

	return <AnonymousCatalog {...props} />;
}
