import { Hooks } from '@nti/web-commons';
import { getPrivacyLink, getTermsLink } from 'internal/data';

import Text from '../text';

const { useResolver } = Hooks;
const { isPending, isResolved } = useResolver;

export default function TermsAndConditions() {
	const resolver = useResolver(async () => {
		return {
			privacyLink: await getPrivacyLink(),
			termsLink: await getTermsLink(),
		};
	}, []);

	const loading = isPending(resolver);
	const { privacyLink, termsLink } = isResolved(resolver) ? resolver : {};

	if (loading) {
		return null;
	}

	return (
		<Text.Medium center>
			By creating an account,
			<br /> you agree to the{' '}
			<a href={termsLink} target="_blank" rel="noopener noreferrer">
				Terms of Use
			</a>
			<br /> and you acknowledge the{' '}
			<a href={privacyLink} target="_blank" rel="noopener noreferrer">
				Privacy Policy.
			</a>
		</Text.Medium>
	);
}
