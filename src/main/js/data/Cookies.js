/**
 * Return a value for a given cookie name
 * https://stackoverflow.com/questions/5639346/what-is-the-shortest-function-for-reading-a-cookie-by-name-in-javascript
 * @param  {string} name the cookie to look up
 * @returns {string}      the cookie value
 */
export function get(name) {
	const { cookie } = global.document || {};

	if (!cookie) {
		return null;
	}

	const match = cookie.match(`(^|[^;]+)\\s*${name}\\s*=\\s*([^;]+)`);

	return match ? match.pop() : null;
}

export function set(name, value, exp) {
	if (!global.document) {
		return;
	}

	let cookie = `${name}=${encodeURIComponent(value)}`;

	if (exp) {
		cookie = `${cookie};expires=${exp.toGMTString()}`;
	}

	cookie = `${cookie};path=/`;

	global.document.cookie = cookie;
}

export function clear(name) {}
