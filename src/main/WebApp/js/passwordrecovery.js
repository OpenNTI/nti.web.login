(function($){
    var resetPassUrl;

	function parseResponseText(response) {
		if(/application\/json/i.test(response.getResponseHeader('Content-Type'))){
			if (response && response.responseText) {
				try{
					return JSON.parse(response.responseText);
				}
				catch(e){
					console.error('Bad json?', e);
				}
			}
		}

		return null;
	}

	function handleNoResetLink(data){
		//Hmm, weve seen a case were from a password reset link.  It happens if you hit the
		//reset link while logged in as another user.  What to do here? Send to login page which
		//will take you into the app if you actually are logged in?
		//TODO what else could we do here?  I'm sure design would love another dialog box
		console.warn('No reset link present.  Logged into another browser?', data);

		//unlike the login page the user must click a link to get here so we shouldn't
		//end up in a redirect loop.
		//window.location.replace('/');
	}

	function showError(errorText){
		 $('#message').removeClass('green');
         $('#message').addClass('red');
         $('#message').text(errorText);
	}

    function anonymousPing(){
        $('#account-creation').hide();
        $.ajax({
            dataType: 'json',
            url: location.protocol+'//'+location.host +'/dataserver2/logon.ping',
            headers: {Accept:'application/json'},
            type: 'GET'
        }).done(function(data){
            resetPassUrl = getLink(data,'logon.reset.passcode');
			if(!resetPassUrl){
				handleNoResetLink(data);
			}
        }).fail(function(){
            console.error('failed to resolve service...will retry in 5 seconds');
            setTimeout(anonymousPing,5000);
        });
    }

    function setupForm(){
        $('#recover').submit(function(e){
            var pass1 = $('#password').val(),
                pass2 = $('#password-verify').val(),
                username = window.requestParameters['username'],
                id = window.requestParameters['id'];

            e.stopPropagation();
            e.preventDefault();

            $.ajax({
                url: location.protocol+'//'+location.host + resetPassUrl,
                dataType: 'json',
                headers: {Accept:'application/json'},
                type: 'POST',
                data: {username: username, id: id, password: pass1}
            })
                .done(function(data){
//                    console.log('suc',arguments);
                    window.location.replace('index.html?host=' + host + '&return=' + returnUrl );
                })
                .fail(function(data){
                    var o = parseResponseText(data);
					if(!o){
						o = {};
						console.warn('An unknown error occurred when requesting reset', data);
						o.message = 'An unknown error occurred resetting your password.'
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

        hasRequiredInputs = (window.requestParameters['username'] && window.requestParameters['id']);

        if (hasRequiredInputs && pass1 && pass2 && pass1 === pass2) {
            $('#submit').removeAttr('disabled');
        }
        else {
            $('#submit').attr('disabled', true);
        }

    }


    $(function(){
        //get data from server that we will need and setup any forms and listeners:
        anonymousPing();
        setupForm();

        $('#password').blur(enableSubmit).keyup(enableSubmit);
        $('#password-verify').blur(enableSubmit).keyup(enableSubmit);
    });
}(jQuery));
