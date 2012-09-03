(function($){
	var emailRx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
		emailLastValid,
		originalMessage,
		message,
		username,
		password,
		remember,
		allowRel = {
			//white list
		},
		recoverNameUrl,
		recoverPassUrl,
		resetPassUrl,
		cookies = {},
		rel = {},
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

	function formValidation(){
		var validEmail = username.value.length>3;//(emailRx.test(username.value));

		if(!validEmail){
			clearForm();
		}

		if(validEmail && emailLastValid !== username.value){
			emailLastValid = username.value;
			ping();
		}

		$('#submit').prop("disabled", (!validEmail) || !password.value || !rel['logon.nti.password']);
	}

	function clearForm(){
		messageUser();//reset the message
		$('body').removeClass(function(i,c){return c.replace('signin','');});
		$('#oauth-login button').remove();
		rel = {};
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
		return {
			username: username.value,
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
			l = host+url,// + "?dc="+(new Date().getTime()),
			f = { withCredentials: true },
			h = {
				Accept:'application/json',
				Authorization:a,
				'Content-Type':'application/x-www-form-urlencoded'
			};

		if(!a){ delete h.Authorization; f = {}; }
		if(!data) { delete h['Content-Type']; }

		var x = $.ajax({
			xhrFields: f,
			url: l,
			type: m,
			headers: h,
			data: data,
			dataType: 'json'
		}).fail(function(){
			console.error('The request failed. Server up? CORS?\nURL: '+l);
			if(back){ back.call(window, 0 ); }
		}).done(function(data){
			if(back){ back.call(window, data || x.status ); }
		});
	}

	function offline(){
		messageUser('You are offline.','offline');
		mask();
		document.getElementById('mask-msg').innerHTML = "";
		setTimeout(function(){ location.reload(); },30000);
	}

	function ping(){
		call('/dataserver2/logon.ping',null,pong);
	}

	function pong(o){
		var auth = getAuth(),
			link = getLink(o,'logon.handshake'),
			nextMonth = new Date(new Date().getTime()+(1000*60*60*24*31)); //31 days;

		if(o.offline){
			offline();
			return;
		}

		if(!link){
			error(o===0?'Server communication failure, please try again later.':false);
			return;
		}

		//clear it everytime... just incase they change their mind about 'remember me'
		setCookie('username','null',new Date(1));

		//reset it.
		setCookie('username',username.value,auth.remember?nextMonth:null);

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
		clearForm();
		for(;i>=0; i--){
			v = links[i];

			if(v.rel === 'logon.continue' && cookies['continued']!=='1'){
				setCookie('continued','1', new Date(new Date().getTime()+60000));//one minute from now
				redirect();
			}

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
				addButton(v.rel);
			}
//			else {
//				console.log('debug: ',v.rel);
//			}
		}
	}

	function addButton(rel){
		$('<button type="button" name="'+rel+'" title="'+rel+'" class="'+rel.replace(/\./g,' ')+'">'+rel+'</button>')
			.appendTo('#oauth-login');
	}

	function error(msg){
		if(msg){emailLastValid = null;}
		messageUser(msg||'Please try again, there was a problem logging in.','error');
	}

	function messageUser(msg,cls){
		unmask();
		if(cls) { $('body').addClass(cls); }
		message.innerHTML = msg || originalMessage;
	}

	function loginWithRel(r,xhr){
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
					return error();
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
		loginWithRel('logon.nti.password',true);
		return stop(e||event);
	}

	function clickHandler(e){
		var t = $(e.target);
		if(t.is('button')){
			loginWithRel(t.attr('name'),false);
		}
	}

	function moveFocus(e){
		e = e || event;
		if(e.keyCode === 13){
			password.focus();
			return stop(e);
		}
		return true;
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
			recoverNameUrl = getLink(data,'logon.forgot.username');
			recoverPassUrl = getLink(data,'logon.forgot.passcode');
			resetPassUrl = getLink(data,'logon.reset.passcode');

			if(getLink(data,'account.create')){
				$('#account-creation').show();
			}
		}).fail(function(){
			console.error('failed to resolve service...will retry in 5 seconds');
			setTimeout(anonymousPing,5000);
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

		$('#recover').submit(function(e){
			var val = $('#recover input').val();
			e.stopPropagation();
			e.preventDefault();

			$('#recover').html('<h1>Thanks!</h1>');
			setTimeout(function(){
				$('.forgot .dialog').hide();
			},5000);

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
	

	$(function(){
		anonymousPing();
		var a, i, v;

		message = document.getElementById('message');
		password = document.getElementById('password');
		username = document.getElementById('username');
		remember = document.getElementById('remember');

		setInterval(formValidation,1000);

		originalMessage = message.innerHTML;

		setupRecovery();

		$(username).keyup(moveFocus);
		$('oauth-login').click(clickHandler);
		$('#login').submit(submitHandler);

		$('#forgotit').click(function(e){
			e.stopPropagation();
			e.preventDefault();
			$(this).parent().find('.dialog').show();
			return false;
		});

		if(requestParameters.failed){ error(); }

		$('#account-creation a').attr('href',function(i,at){ return at + location.search; });

		a = document.cookie.split(/;\s*/g);
		for(i=0;i<a.length;i++){
			v = a[i].split('=');
			cookies[v[0]] = v[1];
			if(v[0]==='username'){
				remember.checked = true;
				username.value = decodeURIComponent(v[1]);
				username.focus();
			}

		}


		handleCache();
	});
}(jQuery));
