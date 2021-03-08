import React from 'react';

import { getPrivacyLink, getTermsLink } from 'internal/data';

import Text from '../text';

export default function TermsAndConditions() {
	return (
		<Text.Medium center>
			By creating an account, you agree to <br />{' '}
			<a href={getTermsLink()} target="_blank" rel="noopener noreferrer">
				Terms of Use
			</a>{' '}
			and{' '}
			<a
				href={getPrivacyLink()}
				target="_blank"
				rel="noopener noreferrer"
			>
				Privacy Policy.
			</a>
		</Text.Medium>
	);
}
