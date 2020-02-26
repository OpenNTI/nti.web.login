import getOauthLinks from './get-oauth-links';

export default function hasOauthLinks (handshake) {
	return getOauthLinks(handshake).length > 0;
}