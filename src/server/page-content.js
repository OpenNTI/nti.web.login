/*eslint-disable no-console, strict, import/no-commonjs*/
const path = require('path');

exports.renderer = async (cfg, mark) => {
	global.$AppConfig = cfg;
	const ssrEntry = require('./ssr-entry').default;
	const url = path.join(cfg.basepath, cfg.url);

	const result = await ssrEntry(url) || 'NO RESULTS';

	console.log('URL: ', url);

	return cfg.html + result;
};