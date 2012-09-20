(function($){
    var resetPassUrl;

    function anonymousPing(){
        $('#account-creation').hide();
        $.ajax({
            dataType: 'json',
            url:host+'/dataserver2/logon.ping',
            headers: {Accept:'application/json'},
            type: 'GET'
        }).done(function(data){
                resetPassUrl = getLink(data,'logon.reset.passcode');
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
                url: host+resetPassUrl,
                dataType: 'json',
                headers: {Accept:'application/json'},
                type: 'POST',
                data: {username: username, id: id, password: pass1}
            })
                .done(function(data){
//                    console.log('suc',arguments);
                    window.location.replace('index.html');
                })
                .fail(function(data){
//                    console.log('fail',arguments);
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
