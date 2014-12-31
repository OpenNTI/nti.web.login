(function($) {
	var resetPassUrl,
		defaultMessage = '...';

	function parseResponseText(response) {
		if (/application\/json/i.test(response.getResponseHeader('Content-Type'))) {
			if (response && response.responseText) {
				try {
					return JSON.parse(response.responseText);
				}
				catch (e) {
					console.error('Bad json?', e);
				}
			}
		}

		return null;
	}

	function handleNoResetLink(data) {
		//Hmm, weve seen a case were from a password reset link.  It happens if you hit the
		//reset link while logged in as another user.  What to do here? Send to login page which
		//will take you into the app if you actually are logged in?
		//TODO what else could we do here?  I'm sure design would love another dialog box
		console.warn('No reset link present.  Logged into another browser?', data);

		//unlike the login page the user must click a link to get here so we shouldn't
		//end up in a redirect loop.
		//window.location.replace('/');

		var url = getLink(data, 'logon.logout') + '?_cd+' + (new Date()).getTime() + '&success=' + encodeURIComponent(location.toString());
		if (url) {
			location.replace(url);
		}
	}

	function showError(errorText) {
		 $('#message').removeClass('green')
				.addClass('red')
				.text(errorText);
	}


	function showSuccess(text) {
		 $('#message').removeClass('red')
				.addClass('green')
				.html(text || defaultMessage);
	}


	function anonymousPing() {
		$('#account-creation').hide();
		$.ajax({
			dataType: 'json',
			url: location.protocol + '//' + location.host + '/dataserver2/logon.ping',
			headers: {Accept: 'application/json'},
			type: 'GET'
		}).done(function(data) {
			resetPassUrl = getLink(data, 'logon.reset.passcode');
			if (!resetPassUrl) {
				handleNoResetLink(data);
			}
		}).fail(function() {
			console.error('failed to resolve service...will retry in 5 seconds');
			setTimeout(anonymousPing, 5000);
		});
	}

	function setupForm() {
		$('#recover').submit(function(e) {
			var pass1 = $('#password').val(),
				pass2 = $('#password-verify').val(),
				username = window.requestParameters.username,
				id = window.requestParameters.id;

			e.stopPropagation();
			e.preventDefault();
            $("#message").addClass('submitted');

			$.ajax({
				url: location.protocol + '//' + location.host + resetPassUrl,
				dataType: 'json',
				headers: {Accept: 'application/json'},
				contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
				type: 'POST',
				data: {username: username, id: id, password: pass1}
			})
				.done(function(data) {
					var n = 5,
						link = 'index.html?return=' + returnUrl,
						impatient = '<a style="float:right; display:block;" href="' + link + '">' + getString('Login &#9658;') + '</a>';

					function countdown() {
						var wait = '<p>' + impatient + getString('Redirecting to login in... ') + n + '</p>';

						showSuccess(getString('Password reset successful.') + wait);
						n--;
						if (n <= 0) {
							window.location.replace(link);
						}
					}

					setInterval(countdown, 1000);
					countdown();
				})
				.fail(function(data) {
					var o = parseResponseText(data);
					if (!o) {
						o = {};
						console.warn('An unknown error occurred when requesting reset', data);
						o.message = getString('An unknown error occurred resetting your password.');
					}
					showError(o.message || o.code);
				});

			return false;
		});

	}


	function enableSubmit() {
		var pass1 = $('#password').val(),
			pass2 = $('#password-verify').val(),
			hasRequiredInputs = false;

		hasRequiredInputs = (window.requestParameters.username && window.requestParameters.id);
		if(!hasRequiredInputs) {
			//throw 'NoData';
		}

        // Clear submission flag.
        if($("#message").hasClass("submitted")){
            $("#message").removeClass("submitted");
        }

		if (!pass1 || !pass2 || pass1 !== pass2) {
			$('#submit').attr('disabled', true);

			return false;
		}

		$('#submit').removeAttr('disabled');
		return true;
	}


	function verifyPassword() {
        // NOTE: we only do this password validation prior to submission.
        if($("#message").hasClass("submitted")){
            return;
        }

		var valid = enableSubmit(),
			pass1 = $('#password').val(),
			pass2 = $('#password-verify').val();

		if (pass1 && pass1 !== pass2) {
			showError(getString('Passwords must match.'));
		} else {
			showSuccess();
		}
	}


	function buffer(fn, b) {
		var i;
		return function(e) {
			clearTimeout(i);
			i = setTimeout(function(){
				fn(e);
			}, b);
		};
	}

	$(function() {
		//get data from server that we will need and setup any forms and listeners:
		anonymousPing();
		setupForm();

		defaultMessage = $('#message').html();

		var v = buffer(verifyPassword, 250);

		$('#password').blur(enableSubmit).keyup(enableSubmit);
		$('#password-verify')
			.blur(v)
			.keyup(v);
	});
}(jQuery));
