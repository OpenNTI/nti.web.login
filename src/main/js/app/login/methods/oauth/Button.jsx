import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import {Button} from '../../../../common';

import Styles from './Styles.css';

const cx = classnames.bind(Styles);
const getServiceName = rel => rel.split('.')[1].toLowerCase();

OauthButton.propTypes = {
	link: PropTypes.shape({
		rel: PropTypes.string.isRequired,
		href: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired
	}).isRequired,
	returnURL: PropTypes.string
};
export default function OauthButton ({link, returnURL}) {
	const {rel, title, href} = link;

	const base = global.location;
	const url = new URL(href, base);

	url.searchParams.set('success', returnURL || base);
	url.searchParams.set('failure', base);

	return (
		<Button as="a" href={url.toString()} className={cx('oauth-button', getServiceName(rel))}>
			{title}
		</Button>
	);
}
