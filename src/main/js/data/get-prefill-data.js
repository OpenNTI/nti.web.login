import { getServer } from "@nti/web-client"; //eslint-disable-line

export default async function getPrfillData (id) {
	// const server = await getServer();
	// const link = new URL('REPLACE_ME');
	// link.searchParams.append('id', id);
	return Promise.resolve({
		realname: 'Josh Birdwell',
		hideRealname: true,
		email: 'josh.birdwell@nextthought.com',
		hideEmail: true,
		Username: 'jbirdwell'
	});
	// server.get(link.href);
}
