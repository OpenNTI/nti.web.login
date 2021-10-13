import { Theme, Background } from '@nti/web-commons';

const Container = styled(Background)`
	--max-content-width: 500px;
`;

const getBackgroundURL = background => {
	if (!background) {
		return null;
	}

	const { href, cacheBust } = background;

	return cacheBust ? `${href}?v=${cacheBust}` : href;
};

export default function PageBackground(props) {
	const background = Theme.useThemeProperty('background');

	return (
		<Container
			className="page-container"
			imgUrl={getBackgroundURL(background)}
			{...props}
		/>
	);
}
