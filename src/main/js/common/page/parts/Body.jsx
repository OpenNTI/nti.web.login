import {mergeClassName as add} from '../../utils';

const PageBody = styled('section').attrs(add('page-body'))`
	flex: 1 1 auto;
	padding-top: 3rem;
	padding-bottom: 1.5rem;

	@media (max-width: 600px) {
		padding-top: 1.5rem;
	}
`;

export default PageBody;
