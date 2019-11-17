const IS_LOGON_REL_REGEX = /^logon\./;

const BLACK_LIST = {
	'logon.forgot.passcode': true,
	'logon.forgot.username': true,
	'logon.handshake': true,
	'logon.reset.passcode': true,
	'logon.ping': true
};

function isOauthREL (rel) {
	return IS_LOGON_REL_REGEX.test(rel) && !BLACK_LIST[rel];
}

export default function getOauthLinks (handshake) {
	if (!handshake || !handshake.links) { return []; }

	return handshake.links
		.filter(isOauthREL)
		.map(rel => handshake.getLink(rel, true));
}