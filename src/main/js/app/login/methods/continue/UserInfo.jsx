import React from 'react';

import { getService } from '@nti/web-client';
import { User, Loading, Text } from '@nti/web-commons';

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 200px;
	min-height: 150px;
	margin: 2rem auto;
	padding: 1.5rem;
	box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.19), 0 0 3px 0 rgba(0, 0, 0, 0.3);
	border-radius: 3px;
	overflow: hidden;
`;

const Avatar = styled(User.Avatar)`
	width: 120px;
	height: 120px;
	border-radius: 120px;
	display: block;
	margin-bottom: 0.875rem;
`;

const DisplayName = styled(User.DisplayName)`
	display: block;
	overflow: hidden;
	font-size: 1.25rem;
	font-weight: bold;
	line-height: 1.3;
	white-space: normal;
	word-wrap: break-word;
	word-break: break-all;
	word-break: break-word;
	color: var(--primary-grey);
`;

const Spinner = styled(Loading.Spinner.Large)`
	margin: 99px auto;
`;

export default function UserInfo() {
	const [loading, setLoading] = React.useState(false);
	const [user, setUser] = React.useState(null);

	React.useEffect(() => {
		const getUser = async () => {
			setLoading(true);

			try {
				const service = await getService();
				const appUser = await service.getAppUser();

				setUser(appUser);

				setLoading(false);
			} catch (e) {
				setLoading(false);
			}
		};

		if (!user && !loading) {
			getUser();
		}
	});

	if (!loading && !user) {
		return null;
	}

	return (
		<Loading.Placeholder loading={loading} delay={0} fallback={<Spinner />}>
			<Container className="user-info">
				{user && <Avatar user={user} />}
				{user && (
					<DisplayName tag={Text.Base} user={user} limitLines={2} />
				)}
			</Container>
		</Loading.Placeholder>
	);
}
