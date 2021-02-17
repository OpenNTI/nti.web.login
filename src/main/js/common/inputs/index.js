import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Form } from '@nti/web-commons';

import styles from './index.css';

function WrapperFactory(Cmp, inputProps) {
	FormInput.propTypes = {
		className: PropTypes.string,
		inputRef: PropTypes.any,
	};
	function FormInput({ className, inputRef, ...otherProps }) {
		return (
			<Cmp
				className={cx(className, styles.input)}
				ref={inputRef}
				underlined
				{...inputProps}
				{...otherProps}
			/>
		);
	}

	const RefWrapper = (props, ref) => <FormInput {...props} inputRef={ref} />;
	return React.forwardRef(RefWrapper);
}

export default {
	Text: WrapperFactory(Form.Input.Text),
	Email: WrapperFactory(Form.Input.Email),
	Password: WrapperFactory(Form.Input.Text, { type: 'password' }),
	Checkbox: WrapperFactory(Form.Input.Checkbox),
	Hidden: WrapperFactory(Form.Input.Hidden),
};
