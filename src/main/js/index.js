import React from 'react';
import ReactDOM from 'react-dom';

function TestCmp () {
	return (
		<div>
			Hello from Web Login
		</div>
	);
}

ReactDOM.render(
	React.createElement(TestCmp),
	document.getElementById('content')
);