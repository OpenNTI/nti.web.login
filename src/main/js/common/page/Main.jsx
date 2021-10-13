import PropTypes from 'prop-types';
//TODO: add a transition between components

const Container = styled.div`
	margin: 0 0 0 auto;
	width: 100vw;
	max-width: var(--max-content-width, 500px);
	min-height: calc(var(--vh, 1vh) * 100);
	background: white;
	position: relative;
	box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.2);

	& > div[role='group'] {
		height: 100%;
	}

	@media (max-width: 600px) {
		max-width: 100vw;
	}
`;

PageMain.propTypes = {
	component: PropTypes.any,
};
export default function PageMain({ component: Cmp, ...otherProps }) {
	return (
		<Container>
			<Cmp {...otherProps} />
		</Container>
	);
}
