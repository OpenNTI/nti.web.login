import Form from './Form';

export default {
	name: 'continue',
	isAvailable: ({handshake}) => handshake.hasLink('logon.continue'),

	Form
};