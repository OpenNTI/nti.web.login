import getReturnURL from './get-return-url';

export default function getLoginRedirectURL () {
	//TODO: be smarter about this;
	return `${getReturnURL()}?_u=42`;
}