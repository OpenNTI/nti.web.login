import React from 'react';

import {Text, Routing} from '../../../../common';

const Block = styled(Text.Body)`
	margin-bottom: 2.25rem;
`;

export default function Recover () {
	return (
		<Block right className="recover">
			I forgot my <Routing.Link to="/login/recover/username">username</Routing.Link> or <Routing.Link to="/login/recover/password">password.</Routing.Link>
		</Block>
	);
}
