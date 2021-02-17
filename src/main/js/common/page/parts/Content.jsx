import { mergeClassName as add } from '../../utils/';
const PageContent = styled('article').attrs(add('page-content'))`
	display: flex;
	flex-direction: column;
	min-height: calc(var(--vh, 1vh) * 100);
`;

export default PageContent;
