import PropTypes from 'prop-types';
import { Link } from '@reach/router';

import { addReturnParam } from './util';

RoutingLink.propTypes = {
	to: PropTypes.string,
};
export default function RoutingLink({ to, ...otherProps }) {
	return <Link to={addReturnParam(to)} {...otherProps} />;
}
