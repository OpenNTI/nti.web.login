import { useEffect } from 'react';
import { navigate, globalHistory, useLocation } from '@reach/router';

import { AnonymousPage as AnonymousCatalog } from '@nti/web-catalog';
import { getHistory } from '@nti/web-routing';

const webRoutingHistory = getHistory();

/**
 * reach/router and nti/web-routing both push to the browsers history object,
 * and neither listen for changes to update their state... This hook is setup
 * so that changes to one router will be represented in the other.
 */
function useRouterBridge() {
	const location = useLocation();

	//When nti/web-routing changes
	useEffect(() => {
		return webRoutingHistory.listen(({ pathname, state }) => {
			if (globalHistory.location?.pathname !== pathname) {
				navigate(pathname, { replace: true });
			}
		});
	}, []);

	//When reach/router changes
	useEffect(() => {
		if (location.pathname !== webRoutingHistory.pathname) {
			webRoutingHistory.replace(location.pathname);
		}
	}, [location.pathname]);
}

export function Catalog(props) {
	useRouterBridge();

	return <AnonymousCatalog {...props} />;
}
