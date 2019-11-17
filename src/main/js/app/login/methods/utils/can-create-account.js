export default function canCreateAccount (handshake) {
	return handshake && handshake.hasLink('account.create');
}