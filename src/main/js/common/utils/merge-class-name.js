import cx from 'classnames';
export const mergeClassName = className => props => {
	return {
		...props,
		className: cx(className, props.className),
	};
};
