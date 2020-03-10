import { getServer } from "@nti/web-client"; //eslint-disable-line

const INVITATION_INFO_URL = '/dataserver2/invitation-info';

export default async function getPrfillData (id) {
	const server = await getServer();
	const data = await server.get(INVITATION_INFO_URL);
	const isNameAnEmail = data['receiver_name'] === data.receiver;

	return {
		...data,
		receiver: data.receiver,
		requireMatchingEmail: data['require_matching_email'],
		receiverName: isNameAnEmail ? '' : data['receiver_name'],
	};
}