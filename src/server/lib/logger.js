const {default: Logger} = require('nti-util-logger');

const logger = Logger.get('nti.web.login');

module.exports = {

	info () {
		logger.info(...arguments);
	},


	error () {
		logger.error(...arguments);
	},


	warn () {
		logger.warn(...arguments);
	},


	debug () {
		logger.debug(...arguments);
	}

};
