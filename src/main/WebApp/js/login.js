(function($){
	var emailRx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
		ghanaUser = /^(spmps|mise)\d{2}$/i,
		emailLastValid,
		originalMessage,
		message,
		username,
		password,
		remember,
		allowRel = {
			//white list
			"logon.openid": true
		},
		recoverNameUrl,
		recoverPassUrl,
		resetPassUrl,
		cookies = {},
		rel = {},
		pingHandshakeTimer,
		noOp = function(){},
		//for browsers that don't have the console object
		console = window.console || {
			error:function(){ window.alert.apply(window,arguments); },
			log: function(){ noOp.apply(this,arguments); }	//shutup the interpreter warnings about wrong arg-count
		};

	function mask(){
		$('body').addClass('loading');
	}

	function unmask(){
		$('body').removeClass('loading');
	}

	function updateSubmitButton(){
		var validEmail = username.value.length>3;//(emailRx.test(username.value));
		$('#submit').prop("disabled", (!validEmail) || !password.value || !rel['logon.nti.password']);
	}

	function sendPingIfNecessary(){
		clearTimeout(pingHandshakeTimer);
		pingHandshakeTimer = setTimeout(ping, 500);
	}

	function formValidation(){
		var validEmail = username.value.length>3;

		if(validEmail && emailLastValid !== username.value){
			resetForPingHandshake();
			emailLastValid = username.value;
			sendPingIfNecessary();
		}

		updateSubmitButton();
	}

	function moveFocus(e){
		e = e || event;
		if(e.keyCode === 13){
			password.focus();
			return stop(e);
		}
		return true;
	}

	function usernameChanged(e){
		if(!moveFocus(e)){
			return false;// handle enter key to move focus down which should trigger blur
		}
		return formValidation(e);
	}

	function resetForPingHandshake()
	{
		$('body').removeClass(function(i,c){return c.replace('signin','');});
		$('#oauth-login button').remove();
		rel = {};
	}

	function clearForm(){
		messageUser();//reset the message
		resetForPingHandshake();
	}

	function stop(e){
		e.cancelBubble = true;
		if(e.stopPropagation){ e.stopPropagation(); }
		if(e.preventDefault){ e.preventDefault(); }
		return false;
	}

	function appendUrl(base,param) {

		return base.indexOf(param) >= 0
			? base
			: (base + (base.indexOf('?') === -1 ? '?' : '&') + param);
	}

	function toPost(o){
		var k, t,string = [];
		for(k in o){
			if(o.hasOwnProperty(k)){
				t = typeof o[k];
				if(t==='string' || t==='boolean' || t==='number') {
					string.push([encodeURIComponent(k),encodeURIComponent(o[k])].join('='));
				} else {
					console.log(typeof o[k], k, o[k]);
				}
			}
		}
		return string.join('&');
	}

	function getAuth(){
		var v = username.value.trim().toLowerCase(),
			u = ghanaUser.test(v) ? v+'@aops_ghana.nextthought' : v;
		return {
			username: u,
			password: password.value,
			remember: remember.checked
		};
	}

	function getRedirects(xhr){
		if(xhr){
			return {};
		}

		return {
			success: returnUrl,
			failure: appendUrl(location.href, "failed=true")
		};
	}

	function setCookie(name,value,exp){
		document.cookie=name+"="+encodeURIComponent(value) +
						(exp?('; expires='+exp.toGMTString()) : '') + '; path=/';
	}

	function redirect(){
		location.replace(returnUrl);
	}

	function call(url,data,back,forceMethod){
		var u = data? data.username : undefined,
			p = data? data.password : undefined,
			a = p? ('Basic '+btoa(u+':'+p)) : undefined,
			m = forceMethod? forceMethod : data? 'POST':'GET',
			l = host+url,/* + "?dc="+(new Date().getTime()),*/
			f = { withCredentials: true },
			h = {
				Accept:'application/json',
				Authorization:a,
				'Content-Type':'application/x-www-form-urlencoded'
			};

		if(!a){ delete h.Authorization; f = {}; }
		if(!data) { delete h['Content-Type']; }

		if (m === 'GET' && data){
			delete data.password;
			delete data.remember;
			delete data.username;
		}

		var x = $.ajax({
			xhrFields: f,
			url: l,
			type: m,
			headers: h,
			data: data,
			dataType: 'json'
		}).fail(function(jqXHR, textStatus){
			//console.error('The request failed. Server up? CORS?\nURL: '+l, textStatus, jqXHR.status);
			if(back){ back.call(window, jqXHR.status ); }
		}).done(function(data){
			if(back){ back.call(window, data || x.status ); }
		});
	}

	function offline(){
		messageUser('You are offline.','offline');
		mask();
		document.getElementById('mask-msg').innerHTML = "";
	}

	function ping(){
		call('/dataserver2/logon.ping',null,pong);
	}

	function pong(o){
		var auth = getAuth(),
			link = getLink(o,'logon.handshake');

		if(o.offline){
			offline();
			return;
		}

		if(!link){
			error(typeof(o)==='number'?'Server communication failure, please try again later.':false);
			return;
		}


		call(link,auth,handshake);
	}

	function handshake(o){
		if(typeof o === 'number' || !o){
			error();
			return;
		}

		if(o.offline){
			offline();
			return;
		}

		var links = o.Links || [],
			i = links.length-1,v;

		//clearForm();

		for(;i>=0; i--){
			v = links[i];

			rel[v.rel] = v.href;

			if(/result/i.test(v.rel)){
				console.log(v.rel, getLink(o,v.rel));
				call(getLink(o,v.rel),getAuth(),function(){
					console.log('What?',arguments);
				});
			}


			$('body').addClass(v.rel.replace(/\./g,'-'));
			if(allowRel[v.rel]===true){
				$('body').addClass('or');
				addButton(v);
			}
//			else {
//				console.log('debug: ',v.rel);
//			}
		}
		updateSubmitButton();
	}

	function addButton(rel, optionalSelector){
		var title;
		if( typeof rel === "object" ){
			title = rel.title;
			rel = rel.rel;
		}else{
			title = rel;
		}

		return $('<button type="button" name="'+rel+'" title="'+title+'" class="'+rel.replace(/\./g,' ')+'">'+title+'</button>')
			.appendTo(optionalSelector || '#oauth-login');
	}

	function error(msg){
		//TODO this isn't being relied on anywhere so far as I can tell.
		// Furthermore I think the interaction between this and the ping
		//timer may be what is triggering the strange page refresh issue that ken and greg complain about.
		//I don't necessarily think removing this will fix it but the use of the timer seems like
		//it could lead to issues
		//if(msg){emailLastValid = null;}
		messageUser(msg||'There was a problem logging in. Please try again.','error');
	}

	function messageUser(msg,cls){
		unmask();
		if(cls) { $('body').addClass(cls); }
		message.innerHTML = msg || originalMessage;
	}

	function loginWithRel(r,xhr){
		if(!rel.hasOwnProperty(r)){
			return;
		}
		mask();
		message.innerHTML = '';
		try{
			var url = appendUrl(rel[r],toPost(getRedirects(xhr)));

			if(!xhr){
				document.getElementById('mask-msg').innerHTML = "Redirecting...";
				location.replace(host+url);
				return;
			}

			call(url, getAuth(), function(o){
				var t = typeof o;

				if((t === 'number' && o !== 204 && o !== 1223) || (t === 'object' && !o.success) || !o){

					var msg = null;
					if(t === 'number' && o == 401){
						msg = 'The username or password you entered is incorrect. Please try again.';
					}
					return error(msg);
				}
				document.getElementById('mask-msg').innerHTML = "Redirecting...";
				redirect();
			}, 'GET');

		}
		catch(er){
			console.error(er.stack);
			unmask();
		}
	}

	function submitHandler(e){
		var nextMonth = new Date(new Date().getTime() + 1000*60*60*24*31);// 31 days
		//check if remember me is checked
		if($('#remember').is(':checked')){
			//if its checked set remember-me-username cookie
			setCookie('remember-me-username',username.value,nextMonth);
		}else{
			//if not clear remember-me-username cookie
			setCookie('remember-me-username','null',new Date(1));
		}
		loginWithRel('logon.nti.password',true);
		return stop(e||event);
	}

	function clickHandler(e){
		var t = $(e.target);
		if(t.is('button')){
			loginWithRel(t.attr('name'),false);
		}
	}

	function handleCache(){
		try {
			var ac = window.applicationCache;
			if (!ac) {return;}

			ac.update();
			ac.addEventListener('updateready', function(e) {
				if (ac.status === ac.UPDATEREADY) {
					try{
						ac.swapCache();
						location.reload();
					}
					catch(e){/*sigh*/}
				} else {
					// Manifest didn't changed. Nothing new to serve.
				}
			}, false);
		}
		catch(e){
			//something bad?
		}
	}


	function anonymousPing(){
		$('#account-creation').hide();
		$.ajax({
			dataType: 'json',
			url:host+'/dataserver2/logon.ping',
			headers: {Accept:'application/json'},
			type: 'GET'
		}).done(function(data){
			messageUser();//reset the error message if there was one.
			recoverNameUrl = getLink(data,'logon.forgot.username');
			recoverPassUrl = getLink(data,'logon.forgot.passcode');
			resetPassUrl = getLink(data,'logon.reset.passcode');

			if (getLink(data, 'logon.continue')){
				setupContinue(getLink(data, 'logon.logout'));
				return;
			}

			setupRecovery();
			setupPassRecovery();

			$('div.forgot').show();
			if(getLink(data,'account.create')){
				$('#account-creation').show();
			}
		}).fail(function(){
			console.error('failed to resolve service...will retry in 5 seconds');
			setTimeout(anonymousPing,5000);
		});
	}


	function setupContinue(logoutUrl){
		$('#active-session-login').addClass('visible').html('<div>You are currently logged in somewhere else. Would you like to logout?</div>');
		addButton('No', '#active-session-login').click(redirect);
		addButton('Yes', '#active-session-login').click(function(){
			$.removeCookie('sidt',{path:'/'});//trigger the other tabs to die
			$.ajax({
				url: logoutUrl + '?_dc=' + new Date().getTime()
			})
			.always(function(){location.reload();});
		});
		$('.field-container').hide();
	}


	function setupRecovery(){
		$('#recover input').keyup(function(){
			var sub = $('#recover button');
			if(emailRx.test( $(this).val() )){
				sub.removeAttr('disabled');
			}
			else {
				sub.attr('disabled',true);
			}
		});

		$('.forgot .dialog.username').click(function(e){
			e.stopPropagation();
		});

		$('#recover').submit(function(e){
			var val = $('#recover input').val();
			e.stopPropagation();
			e.preventDefault();

			$('#recover').html('<h1>Thanks!</h1>');
			setTimeout(function(){
				hideDialog($('.forgot .dialog'));
			},1000);

			$.ajax({
				url: host+recoverNameUrl,
				dataType: 'json',
				headers: {Accept:'application/json'},
				type: 'POST',
				data: {email: val}
			});
//			.done(function(data){
//				console.log('suc',arguments);
//			})
//			.fail(function(data){
//				console.log('fail',arguments);
//			});

			return false;
		});
	}


	function setupPassRecovery(){
		function enablePasswordRecoverySubmit(){
			var user = $('#recover-pass-username').val(),
				email = $('#recover-pass-email').val(),
				sub = $('#recoverpass button');

			if(emailRx.test(email) && user){
				sub.removeAttr('disabled');
			}
			else {
				sub.attr('disabled',true);
			}
		}

		$('#recover-pass-username').blur(enablePasswordRecoverySubmit).keyup(enablePasswordRecoverySubmit);
		$('#recover-pass-email').blur(enablePasswordRecoverySubmit).keyup(enablePasswordRecoverySubmit);

		$('.forgot .dialog.password').click(function(e){
			e.stopPropagation();
		});

		$('#recoverpass').submit(function(e){
			var user = $('#recover-pass-username').val(),
				email = $('#recover-pass-email').val(),
				pathname = window.location.pathname.replace('index.html', ''),
				recoveryURL = window.location.protocol + '//' + window.location.host;

			//ensure trailing slash exists on path
			if (pathname.lastIndexOf('/') !== pathname.length - 1){
				pathname += '/';
			}
			recoveryURL += (pathname + 'passwordrecover.html?host=' + host + '&return=' + returnUrl);

			e.stopPropagation();
			e.preventDefault();

			$('#recoverpass').html('<h1>Thanks!</h1>');
			setTimeout(function(){
				hideDialog($('.forgot .dialog'));
			},1000);

			$.ajax({
				url: host+recoverPassUrl,
				dataType: 'json',
				headers: {Accept:'application/json'},
				type: 'POST',
				data: {email: email, username: user, success:recoveryURL}
			});
//			.done(function(data){
//				console.log('suc',arguments);
//			})
//			.fail(function(data){
//				console.log('fail',arguments);
//			});

			return false;
		});
	}


	function hideDialog(dialog){
		$('body').removeClass('dialog-shown');
		dialog.hide();
	}

	if(!window.console){
		window.console = {
			log: function(){},
			error: function(){}
		};
	}

	function parseQueryString(qStr){
		if(!qStr || qStr === ''){return null;}
		var r = {}, parts = qStr.split('&'), i, kv;

		for(i in parts){
			if(parts.hasOwnProperty(i)){
				kv = parts[i];
				kv = kv.split('=');
				r[kv[0]]=kv[1];
			}
		}
		return r;
	}

	function handleQueryParams(){
		var q = location.href.split('?')[1], isUsernameSet;
		if(q){
			q = parseQueryString(q);
			if(q && q['username']){
				$(username).val(decodeURIComponent(q['username'])).change();
				username.focus();
				isUsernameSet = true;
			}
			if(q && q['error']){
				setTimeout(function(){ error(decodeURIComponent(q['error'])) }, 10);
			}
		}
		return isUsernameSet;

	}

	$(function(){
		$('div.forgot').hide();
		anonymousPing();
		var a, i, v, isUsernameSet;

		message = document.getElementById('message');
		password = document.getElementById('password');
		username = document.getElementById('username');
		remember = document.getElementById('remember');

		$('#password').change(formValidation).keyup(formValidation);
		$('#username').change(formValidation).keyup(usernameChanged);

		originalMessage = message.innerHTML;

		$('#oauth-login').click(clickHandler);
		$('#login').submit(submitHandler);

		$('#forgotit').click(function(e){
			e.stopPropagation();
			e.preventDefault();
			hideDialog($(this).parent().find('.dialog'));
			var d = $(this).parent().find('.dialog.username');
			$('body').addClass('dialog-shown');
			d.show();
			d.find('input').focus();
			return false;
		});

		$('#forgotpass').click(function(e){
			e.stopPropagation();
			e.preventDefault();
			hideDialog($(this).parent().find('.dialog'));
			var d = $(this).parent().find('.dialog.password');
			$('body').addClass('dialog-shown');
			d.show();
			d.find('#recover-pass-username').focus();
			return false;
		});

		$('body').click(function(e){hideDialog($(this).parent().find('.dialog'));});

		if(requestParameters.failed){ error(); }

		$('#account-creation a').attr('href',function(i,at){ return at + location.search; });

		//if the username param is set on the url, get it and don't bother checking the cookie.
		isUsernameSet = handleQueryParams();

		if(!isUsernameSet){
			a = document.cookie.split(/;\s*/g);
			for(i=0;i<a.length;i++){
				v = a[i].split('=');
				cookies[v[0]] = v[1];
				if(v[0]==='remember-me-username'){
					remember.checked = true;
					$(username).val(decodeURIComponent(v[1])).change();
					username.focus();
				}
			}
		}

		handleCache();
		$('input,textarea').placeholder();
	});
}(jQuery));
