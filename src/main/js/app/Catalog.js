import { useEffect } from 'react';
import { navigate, globalHistory, useLocation } from '@reach/router';

import { AnonymousPage as AnonymousCatalog } from '@nti/web-catalog';
import { getHistory, Router } from '@nti/web-routing';
import { Models } from '@nti/lib-interfaces';

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

const maybeCatalogEntryPath = (obj, context) => {
	if (context === 'enroll') {
		const catalogEntry = obj?.parent(
			x => x instanceof Models.courses.CatalogEntry
		);
		const id = catalogEntry?.getID?.();
		if (id) {
			return `/app/catalog/item/${id}`;
		}
	}
};

export function Catalog(props) {
	useRouterBridge();
	const { paths } = props;

	// login with return path if provided, else null
	const maybeLoginPath = returnPath =>
		returnPath
			? `${paths.login}?return=${encodeURIComponent(returnPath)}`
			: null;

	const getRouteFor = (obj, context) => {
		if (obj?.type === 'redeem-course-code') {
			return maybeLoginPath('/app/catalog/redeem/');
		}

		return maybeLoginPath(maybeCatalogEntryPath(obj, context));
	};

	return (
		<Router.RouteForProvider getRouteFor={getRouteFor}>
			<AnonymousCatalog {...props} />
		</Router.RouteForProvider>
	);
}

export default Catalog; // React.lazy only supports default exports
