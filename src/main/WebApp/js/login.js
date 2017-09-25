(function ($) {
	var emailRx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
		ghanaUser = /^(spmps|mise)\d{2}$/i,
		emailLastValid,
		originalMessage,
		message,
		username,
		password,
		showErrorOnReady,
		allowRel = {
			//white list
			"logon.openid": true,
      "logon.linkedin.oauth1": true,
      "logon.google": true,
      "logon.ou.sso": true
		},
		aboutURL, supportURL,
		recoverNameUrl,
		recoverPassUrl,
		resetPassUrl,
		submitButtonRel,
		cookies = {},
		rel = {},
		pingHandshakeTimer,
		noOp = function(){},
		//for browsers that don't have the console object
		console = window.console || {
			error:function(){ window.alert.apply(window,arguments); },
			log: function(){ noOp.apply(this,arguments); }
	};


	function mask(){ $('body').addClass('loading'); }


	function unmask(){ $('body').removeClass('loading'); }


	function updateSubmitButton(){
		var validEmail = username.value.length> 3,//(emailRx.test(username.value))
			disabled = !validEmail || !password.value, i, hasOneRel = false;
		if(!disabled){
			disabled = !rel[submitButtonRel];
		}
		$('#submit').prop("disabled", disabled);
	}


	function sendPingIfNecessary(){
		rel = {};
		clearTimeout(pingHandshakeTimer);
		pingHandshakeTimer = setTimeout(ping, 500);
	}


	function formValidation(){
		var validEmail = username.value.length>3;

		if(validEmail && emailLastValid !== username.value) {
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
		return formValidation();
	}


	function resetForPingHandshake() {
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
		return base.indexOf(param) >= 0 ? base : (base + (base.indexOf('?') === -1 ? '?' : '&') + param);
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
			password: password.value
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


	function redirect(){
		var a = document.createElement('a');
		a.setAttribute('href', returnUrl); //normalize uri
		a.search = (a.search ? a.search+'&' : '?') + '_u=42'; //add search string arg

		applyLanguage();

		location.replace(a.href);
	}


	function call(url,data,back,forceMethod){
		var u = data? data.username : undefined,
			p = data? data.password : undefined,
			a = p? ('Basic '+btoa(u+':'+p)) : undefined,
			m = forceMethod? forceMethod : data? 'POST':'GET',
			l = url,/* + "?dc="+(new Date().getTime()),*/
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
		messageUser(getString('You are offline.'),'offline');
		mask();
		document.getElementById('mask-msg').innerHTML = "";
	}


	function ping() {
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
			error(typeof(o)==='number' ?
				getString('Server communication failure, please try again later.') : false);
			return;
		}


		call(link,auth,handshake);
	}


	function handshake(o){
		resetForPingHandshake();
		if(typeof o === 'number' || !o){
			error();
			return;
		}

		if(showErrorOnReady && $.isFunction(showErrorOnReady)){
			showErrorOnReady.call();
			showErrorOnReady = null;
		}

		if(o.offline){
			offline();
			return;
		}

		addOAuthButtons(o.Links || [], true);
		updateSubmitButton();
	}


	function addOAuthButtons(links, callResults) {
		var i = links.length - 1,
			v, submitRelPrefs = ['logon.ldap.ou', 'logon.ldap.okstate', 'logon.nti.password'];

		//clearForm();
		function log() {
			console.log('What?', arguments);
		}

		for (; i >= 0; i--) {
			v = links[i];
			//TODO capture the link's method here so we do the correct action.
			//the ds is doing some funkiness for us right now so that we can do a
			//get to logon.ldap.ou
			rel[v.rel] = v.href;

			if (callResults && /result/i.test(v.rel)) {
				console.log(v.rel, getLink(o, v.rel));
				call(getLink(o, v.rel), getAuth(), log);
			}


			$('body').addClass(v.rel.replace(/\./g, '-'));
			if (allowRel[v.rel] === true) {
				$('body').addClass('or');
				addButton(v);
				$('#account-creation').addClass('oauth');
				$('.creation-text').text('Create an Account');
				if(v.rel === 'logon.ou.sso') {
					$('#account-creation .semi-bold').text('New to ' + getString('application.title-bar-prefix') + '? ');
				} else {
					$('#account-creation .semi-bold').text('New to NextThought? ');
				}

			}
			//else {
			//	console.log('debug: ',v.rel);
			//}
		}

		for (i = 0; i < submitRelPrefs.length; i++) {
			if (rel[submitRelPrefs[i]]) {
				submitButtonRel = submitRelPrefs[i];
				break;
			}
		}
	}


	function addButton(rel, optionalSelector){
		var title,
			button;
		if( typeof rel === "object" ){
			title = rel.title;
			rel = rel.rel;
		}else{
			title = rel;
		}

		 //do not allow duplicates.
	    if ($('button[name="' + rel + '"]').length > 0) {
	      return;
	    }

	    if (title) {
	    	button = '<button type="button" name="'+rel+'" title="'+title+'" class="'+rel.replace(/\./g,' ')+'">'+title+'</button>';
	    } else {
	    	button = '<button type="button" name="'+rel+'" class="'+rel.replace(/\./g,' ')+'"></button>';
	    }

		return $(button)
			.appendTo(optionalSelector || '#oauth-login');
	}


	function error(msg){
		//TODO this isn't being relied on anywhere so far as I can tell.
		// Furthermore I think the interaction between this and the ping
		//timer may be what is triggering the strange page refresh issue that ken and greg complain about.
		//I don't necessarily think removing this will fix it but the use of the timer seems like
		//it could lead to issues
		//if(msg){emailLastValid = null;}
		messageUser(msg|| getString('There was a problem logging in. Please try again.'), 'error');
	}


	function messageUser(msg,cls){
		unmask();
		$(username).removeAttr("aria-invalid");
		$(password).removeAttr("aria-invalid");
		
		if(msg) {
			$("#welcomeMessage").hide();
			$(message).css('opacity', '1');
		}

		if(cls){
			$('body').addClass(cls);
			$(message).html(msg).after(function(){
				$(username).attr({"aria-describedby": "message", "aria-invalid": "true"});
				$(password).attr({"aria-describedby": "message", "aria-invalid": "true"});
			});
		}
		else{
			message.innerHTML = msg || originalMessage;
		}
	}


	function loginWithRel(r,xhr){
		if(!rel.hasOwnProperty(r)){
			return;
		}
		mask();
		$(message).css('opacity', '0');
		try{
			var url = appendUrl(rel[r],toPost(getRedirects(xhr)));

			if(!xhr){
				document.getElementById('mask-msg').innerHTML = getString('Redirecting...');
				applyLanguage();
				location.replace(url);
				return;
			}

			call(url, getAuth(), function(o){
				var t = typeof o;

				if((t === 'number' && o !== 204 && o !== 1223) || (t === 'object' && !o.success) || !o){

					var msg = null;
					if(t === 'number' && o == 401){
						msg = getString('The username or password you entered is incorrect. Please try again.');
					}
					return error(msg);
				}
				document.getElementById('mask-msg').innerHTML = getString('Redirecting...');
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
		loginWithRel(submitButtonRel,true);
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
					catch(er){/*sigh*/}
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
			url:'/dataserver2/logon.ping',
			headers: {Accept:'application/json'},
			type: 'GET'
		}).done(function(data){
			messageUser();//reset the error message if there was one.
			recoverNameUrl = getLink(data,'logon.forgot.username');
			recoverPassUrl = getLink(data,'logon.forgot.passcode');
			resetPassUrl = getLink(data,'logon.reset.passcode');


		    addOAuthButtons(data.Links || []);




			aboutURL = getLink(data, 'about-page');
			supportURL = getLink(data, 'support-email');

			if (aboutURL) { $('#about').attr('href', aboutURL); }
			if (supportURL) { $('#help').attr('href', supportURL); }


			function finishAnonymous(){
				setupRecovery();
				setupPassRecovery();

				$('div.forgot').show();
				if(getLink(data,'account.create')){
					$('#account-creation').show();
				}
			}


			if (getLink(data, 'logon.continue')){
				$.ajax({
					url: getLink(data,'logon.handshake'),
					dataType: 'json',
					contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
					headers: {Accept:'application/json'},
					type: 'POST',
					data: {username: cookies.username}
				}).done(function(dataHS){
					if(getLink(dataHS,'logon.continue')){
						setupContinue(getLink(dataHS, 'logon.logout'));
					}
					else {
						finishAnonymous();
					}
				}).fail(function(){
					var url = getLink(data, 'logon.logout')+'?_cd+'+ (new Date()).getTime()+'&success='+encodeURIComponent(location.toString());
					console.log('Forcing a logout due to handshake failure');
					location.replace(url);
				});
			}
			else {
				finishAnonymous();
			}
		}).fail(function(){
			console.error('failed to resolve service...will retry in 5 seconds');
			setTimeout(anonymousPing,5000);
		});
	}


	function setupContinue(logoutUrl){
		$('#active-session-login').addClass('visible').html(
			'<div>' +
				getString('You are currently logged in somewhere else. Would you like to logout?') +
			'</div>');
		addButton(getString('No'), '#active-session-login').click(redirect);
		addButton(getString('Yes'), '#active-session-login').click(function(){
			$.removeCookie('sidt',{path:'/'});//trigger the other tabs to die
			$.ajax({
				url: logoutUrl + '?_dc=' + new Date().getTime()
			})
			.always(function(){location.reload();});
		});
		$('.field-container').hide();
	}

	function sendRecoverEmail() {
		var val = $('#recover input').val();
		
		$('.forgot .dialog.username .message').html('<h1>' + getString('Thanks!') + '</h1>');
		$('#recover').addClass('submitted');
		$('#recover input').each(function() {
			$(this).val('');
		});

		setTimeout(function(){
			hideDialog($('.forgot .dialog'));
			$('#recover').removeClass('submitted');
		},1000);

		$.ajax({
			url: recoverNameUrl,
			dataType: 'json',
			contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
			headers: {Accept:'application/json'},
			type: 'POST',
			data: {email: val}
		});
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
		
		$('#recover input').keydown(function(e){
			var sub = $('#recover button');
			
			if("Enter" === e.key) {
				if(!sub.attr('disabled')) {
					sendRecoverEmail();
				}
				
				return false;
			}
		});

		$('.forgot .dialog.username').click(function(e){
			e.stopPropagation();
		});

		$('#recover button').click(function(e){
			e.stopPropagation();
			e.preventDefault();
			
			sendRecoverEmail();

			return false;
		});
	}

	function sendRecoverPasswordEmail() {
		var user = $('#recover-pass-username').val(),
			email = $('#recover-pass-email').val(),
			pathname = window.ourPath.replace('index.html', ''),
			recoveryURL = window.location.protocol + '//' + window.location.host;

		//ensure trailing slash exists on path
		if (pathname.lastIndexOf('/') !== pathname.length - 1){
			pathname += '/';
		}
		recoveryURL += (pathname + 'passwordrecover.html?return=' + returnUrl);

		$('.forgot .dialog.password .message').html('<h1>' + getString('Thanks!') + '</h1>');
		$('#recoverpass').addClass('submitted');
		$('#recoverpass input').each(function() {
			$(this).val('');
		});

		setTimeout(function(){
			hideDialog($('.forgot .dialog'));
			$('#recoverpass').removeClass('submitted');
		},1000);

		$.ajax({
			url: recoverPassUrl,
			contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
			dataType: 'json',
			headers: {Accept:'application/json'},
			type: 'POST',
			data: {email: email, username: user, success:recoveryURL}
		});
	}
	
	function maybeDoPassSubmit(e) {
		var sub = $('#recoverpass button');
		
		if("Enter" === e.key) {
			if(!sub.attr('disabled')) {
				sendRecoverPasswordEmail();
			}
			
			return false;
		}
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

		$('#recover-pass-username').blur(enablePasswordRecoverySubmit).keydown(maybeDoPassSubmit);
		$('#recover-pass-email').blur(enablePasswordRecoverySubmit).keydown(maybeDoPassSubmit);

		$('.forgot .dialog.password').click(function(e){
			$('.forgot .dialog.password .message').html('');
			$('#recoverpass').removeClass('submitted');
			e.stopPropagation();
		});

		$('#recoverpass button').click(function(e){
			e.stopPropagation();
			e.preventDefault();
			
			sendRecoverPasswordEmail();

			return false;
		});
	}


	function hideDialog(dialog){
		$('body').removeClass('dialog-shown');
		dialog.hide();
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
			q = parseQueryString(q.split('#')[0]);
			if(q && q.username){
				$(username).val(decodeURIComponent(q.username)).change();
				username.focus();
				isUsernameSet = true;
			}
			if(q && q.error){
				originalMessage = decodeURIComponent(q.error);
				showErrorOnReady = function(){ error(originalMessage); };
			}
		}
		return isUsernameSet;
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


	function toggleAccessibility(el) {
		var onText = el && el.getAttribute('data-on-text'),
			offText = el && el.getAttribute('data-off-text'),
			cookieName = 'use-accessibility-mode',
			cookieVal = $.cookie(cookieName);

		//if no el is passed clear the cookie
		if (!el) {
			setCookie(cookieName, null, new Date(1));
			return;
		}

		if (cookieVal === 'true') {
			$(el).html(offText);
			setCookie(cookieName, 'false');
		} else if (!cookieVal || cookieVal === 'false') {
			$(el).html(onText);
			setCookie(cookieName, 'true');
		}
	}

	function initAccessibility(el) {
		var onText = el && el.getAttribute('data-on-text'),
			offText = el && el.getAttribute('data-off-text'),
			cookieName = 'use-accessibility-mode',
			cookieVal = $.cookie(cookieName);

		if (cookieVal === 'true') {
			$(el).html(onText);
		} else {
			$(el).html(offText);
		}
	}

	function setHeader() {
		var welcomeMessage = getString('Welcome to ') + getString('application.title-bar-prefix');
		var welcomeHeader = $('#welcomeMessage');
		if (welcomeHeader) welcomeHeader.text(welcomeMessage);
	}

	$(function(){
		$('div.forgot').hide();
		anonymousPing();
		setHeader();
		var a, i, v, isUsernameSet;

		message = document.getElementById('message');
		password = document.getElementById('password');
		username = document.getElementById('username');

		$('#password').change(formValidation).keyup(buffer(formValidation, 350));
		$('#username').change(formValidation).keyup(usernameChanged);

		originalMessage = message.innerHTML;

		$('#oauth-login').click(clickHandler);
		$('#login').submit(submitHandler);

		$('#forgotit').click(function(e){
			e.stopPropagation();
			e.preventDefault();
			hideDialog($(this).parent().find('.dialog'));
			var d = $(this).parent().find('.dialog.username');
			d.find('div.message').html('');
			d.find('form').removeClass('submitted');
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
			d.find('div.message').html('');
			d.find('form').removeClass('submitted');
			$('body').addClass('dialog-shown');
			d.show();
			d.find('#recover-pass-username').focus();
			return false;
		});

		$('#accessibility').click(function(e) {
			toggleAccessibility(this);
		});

		initAccessibility($('#accessibility')[0]);

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
					$(username).val(decodeURIComponent(v[1])).change();
					username.focus();
				}
			}
		}

		handleCache();
		$('input,textarea').placeholder();

		setLanguage();
	});

}(jQuery));
