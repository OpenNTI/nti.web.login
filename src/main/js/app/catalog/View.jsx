import { Suspense, useEffect, useState } from 'react';
import { Router } from '@reach/router';

import { Router as NTIRouter } from '@nti/web-routing';
import Catalog from '@nti/web-catalog';
import { useService } from '@nti/web-commons';
import { Info } from '@nti/web-course';

const getRouteFor = obj => {
	if ((obj?.isCourseCatalogEntry || obj?.isCourse) && obj.getID?.()) {
		return `./nti-course-catalog-entry/${obj.getID()}`;
	}
};

const Container = styled('div')`
	max-width: 1024px;
	margin: 0 auto;
`;

const Detail = ({ id, ...other }) => {
	const service = useService();
	const [catalogEntry, setCatalogEntry] = useState();

	useEffect(() => {
		async function loadCatalogEntry() {
			const entry = await service.getObject(id);
			setCatalogEntry(entry);
		}

		loadCatalogEntry();
	}, [id]);

	return (
		<Container>
			{!catalogEntry ? (
				<span>Loading</span>
			) : (
				<Info.Inline catalogEntry={catalogEntry} />
			)}
		</Container>
	);
};

// const CatalogRoutes = Router.for([
// 	Route({
// 		path: '/login/catalog/nti-course-catalog-entry/:id',
// 		getRouteFor,
// 		component: Detail,
// 	}),
// 	Route({
// 		path: '/*',
// 		getRouteFor,
// 		component: Catalog,
// 	}),
// ]);

export function CatalogView(props) {
	return (
		<Suspense fallback={<div />}>
			<NTIRouter.RouteForProvider getRouteFor={getRouteFor}>
				<Router>
					<Detail path="/nti-course-catalog-entry/:id" />
					<Catalog path="/*" />
				</Router>
			</NTIRouter.RouteForProvider>
		</Suspense>
	);
}
