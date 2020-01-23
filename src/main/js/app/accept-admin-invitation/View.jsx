import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {Loading} from '@nti/web-commons';
import classnames from 'classnames/bind';

import {PaddedContainer, Page} from '../../common';
import Store from '../signup/Store';

import Form from './Form';
import Unavailable from './Unavailable';
import Styles from './View.css';

const cx = classnames.bind(Styles);
const t = scoped('nti-login.login.View', {
	unavailable: 'Account creation is unavailable at this time.'
});

AcceptAdminInvitation.propTypes = {
	setup: PropTypes.func.isRequired,
	loading: PropTypes.bool,
	loaded: PropTypes.bool,
	canCreateAccount: PropTypes.bool,
	location: PropTypes.shape({
		href: PropTypes.string
	}),
	prefill: PropTypes.shape({
		realName: PropTypes.string,
		hideRealname: PropTypes.bool,
		email: PropTypes.string,
		hideEmail: PropTypes.bool,
		Username: PropTypes.string
	}),
	error: PropTypes.any
};
function AcceptAdminInvitation ({setup, loading, loaded, canCreateAccount, location, prefill, error }) {
	React.useEffect(() => {
		const isAdminInvitation = true;
		setup(isAdminInvitation);
	}, [location]);

	return (
		<Page.Content className={cx('page-content')}>
			<Page.Header />
			<Page.Body>
				<Page.Description />
				<Loading.Placeholder loading={loading} fallback={(<Loading.Spinner.Large />)}>
					<PaddedContainer>
						{loaded && (!canCreateAccount || error) && (<Unavailable error={error || t('unavailable')} />)}
						{loaded && canCreateAccount && (<Form prefill={prefill} />)}
					</PaddedContainer>
				</Loading.Placeholder>
			</Page.Body>
		</Page.Content>
	);
}

export default Store
	.connect({
		[Store.Setup]: 'setup',
		[Store.HasPing]: 'hasPing',
		[Store.CanCreateAccount]: 'canCreateAccount',
		[Store.Loading]: 'loading',
		[Store.Loaded]: 'loaded',
		[Store.Prefill]: 'prefill',
		[Store.ErrorState]: 'error',
	})(AcceptAdminInvitation);
