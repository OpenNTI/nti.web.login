import { mergeClassName as add } from './utils';

const PaddedContainer = styled('div').attrs(add('padded-container'))`
	padding: 0 3.75rem;

	@media (max-width: 600px) {
		padding: 0 7%;
	}
`;

export default PaddedContainer;
