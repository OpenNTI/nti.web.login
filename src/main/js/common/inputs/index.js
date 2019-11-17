import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Form} from '@nti/web-commons';

import Styles from './Styles.css';

const cx = classnames.bind(Styles);

function WrapperFactory (Cmp, inputProps, wrapperClassName) {
	FormInput.propTypes = {
		className: PropTypes.string,
		inputRef: PropTypes.any
	};
	function FormInput ({className, inputRef, ...otherProps}) {
		return (
			<Cmp
				className={cx(className, wrapperClassName, 'input')}
				ref={inputRef}
				{...inputProps}
				{...otherProps}
			/>
		);
	}

	const RefWrapper = (props, ref) => (<FormInput {...props} inputRef={ref} />);
	return React.forwardRef(RefWrapper);
}

export default {
	Text: WrapperFactory(Form.Input.Text),
	Email: WrapperFactory(Form.Input.Email),
	Password: WrapperFactory(Form.Input.Text, {type: 'password'}),
	Checkbox: WrapperFactory(Form.Input.Checkbox)
};

