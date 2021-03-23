import { getPong } from './get-pong';

const TermsLink =
	'https://docs.google.com/document/d/e/2PACX-1vRJd0Irh_YFX7Ci9irWLmqrEqddrxSLrDkrJMANlCqQAo-PrLznTjk4G0hfCsjxD8M21Vd54iQ1Rqbn/pub';

export async function getTermsLink() {
	try {
		const pong = await getPong();
		return pong.getLink('terms-of-service') || TermsLink;
	} catch (e) {
		return null;
	}
}
