import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import {Text} from '../../common';

import Styles from './View.css';
import Logo from './assets/logo.png';

const cx = classnames.bind(Styles);

UnsupportedPage.propTypes = {
	location: PropTypes.shape({
		href: PropTypes.string
	})
};
export default function UnsupportedPage ({location}) {
	React.useEffect(() => {
		const {href} = location || {};

		if (!href) { return; }

		const url = new URL(href);
		const error = url.searchParams.get('error');

		if (error) {
			console.error('REDIRECT ERROR: ', error);//eslint-disable-line
		}
	}, [location]);

	React.useEffect(() => {
		if (global.document?.referrer && global.history?.replaceState) {
			global.history.replaceState({}, null, global.document.referrer);
		}
	
	}, [location]);


	return (
		<section className={cx('unsupported-page')}>
			<img className={cx('logo')} src={Logo} />
			<Text.Base className={cx('title')}>It looks like you&apos;re using a browser that we don&apos;t support.</Text.Base>
			<Text.Base className={cx('body')}>
				Please try again with the latest version of <a href="http://www.google.com/chrome">Chrome</a>, <a href="http://www.apple.com/safari/download/">Safari</a>, <a href="http://www.getfirefox.com">Firefox</a>, or <a href="http://www.microsoft.com/edge">Microsoft Edge</a><br />with JavaScript <strong><u>enabled</u></strong>.
			</Text.Base>
			<Text.Base className={cx('body')}>
				Try our <a href="/mobile/">mobile site</a>
			</Text.Base>
		</section>
	);
}