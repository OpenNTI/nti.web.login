import { getAnonymousPing } from './get-anonymous-ping';

const TermsLink =
	'https://docs.google.com/document/d/e/2PACX-1vRJd0Irh_YFX7Ci9irWLmqrEqddrxSLrDkrJMANlCqQAo-PrLznTjk4G0hfCsjxD8M21Vd54iQ1Rqbn/pub';

export async function getTermsLink() {
	try {
		const ping = await getAnonymousPing();
		return ping.getLink('terms-of-service') || TermsLink;
	} catch (e) {
		return null;
	}
}
