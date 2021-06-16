import { useEffect } from 'react';
import { navigate, globalHistory, useLocation } from '@reach/router';

import { AnonymousPage as AnonymousCatalog } from '@nti/web-catalog';
import { getHistory, Router } from '@nti/web-routing';

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
		return webRoutingHistory.listen(({ pathname, search, state }) => {
			if (globalHistory.location?.pathname !== pathname) {
				navigate(`${pathname}${search}`, { replace: true });
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
	const { paths } = props;

	const getRouteFor = ({ type } = {}, context) => {
		if (type === 'redeem-course-code') {
			return `${paths.login}?return=${encodeURIComponent(
				'/app/catalog/redeem/'
			)}`;
		}
	};

	return (
		<Router.RouteForProvider getRouteFor={getRouteFor}>
			<AnonymousCatalog {...props} />
		</Router.RouteForProvider>
	);
}

export default Catalog; // React.lazy only supports default exports
