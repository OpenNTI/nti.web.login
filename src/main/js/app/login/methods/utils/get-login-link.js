const LoginPassword = 'logon.nti.password';
const LDAPRegex = /login\.ldap\./;

export default function getLoginLink(handshake) {
	if (!handshake || !handshake.links) {
		return null;
	}

	const { links } = handshake;

	let url = handshake.getLink(LoginPassword);

	//prefer the LDAP link if available
	for (let rel of links) {
		if (LDAPRegex.test(rel)) {
			url = handshake.getLink(rel);
			break;
		}
	}

	return url;
}
