import React from 'react';
import classnames from 'classnames/bind';
import {getService} from '@nti/web-client';//eslint-disable-line
import {User, Loading, Text} from '@nti/web-commons';

import Styles from './UserInfo.css';

const cx = classnames.bind(Styles);

export default function UserInfo () {
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

		if (!user && !loading) { getUser(); }
	});

	if (!loading && !user) { return null; }


	return (
		<Loading.Placeholder loading={loading} delay={0} fallback={(<Loading.Spinner.Large />)}>
			<div className={cx('user-info')}>
				{user && (<User.Avatar user={user} />)}
				{user && (<User.DisplayName tag={Text.Base} user={user} limitLines={2} />)}
			</div>
		</Loading.Placeholder>
	);
}