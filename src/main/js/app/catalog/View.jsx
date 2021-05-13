import { Router, Route } from '@nti/web-routing';
import Catalog from '@nti/web-catalog';

const getRouteFor = obj => {
	if ((obj?.isCourseCatalogEntry || obj?.isCourse) && obj.getID?.()) {
		return `./nti-course-catalog-entry/${obj.getID()}`;
	}
};

export const CatalogView = Router.for([
	Route({
		path: '/*',
		getRouteFor,
		component: Catalog,
	}),
]);
