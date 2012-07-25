(function(){
	var emailRx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
		emailLastValid,
		originalMessage,
		message,
		username,
		password,
		remember,
		submit,
		form,
		oauth,
		params,
		loc = location,
		url = loc.href.split(/[\?#]/g)[0],
		host = loc.protocol+'//'+loc.host,
		hideRel = {
			'logon.nti.password': true,
			'logon.continue': true,
			'logon.google': true,
			'logon.openid': true,
			'logon.facebook': true
			//'logon.logout': true
		},
		rel = {},
		noOp = function(){},
		//for browsers that don't have the console object
		console = window.console || {
			error:function(){ window.alert.apply(window,arguments); },
			log: function(){ noOp.apply(this,arguments); }	//shutup the interpreter warnings about wrong arg-count
		};

	function getClasses(dom){
		var cls = dom.getAttribute('class');
		if(cls) {
			cls = cls.split(' ');
		}
		return cls || [];
	}

	function addClass(dom, className){
		var c = className.toLowerCase(),
			cls = getClasses(dom),
			i = cls.length-1,
			f=false;
		for(; !f&&i>=0; i--){ f = (cls[i].toLowerCase() === c); }
		if(!f){
			cls.push(className);
			dom.setAttribute('class',cls.join(' '));
		}
	}

	function removeClass(dom, className){
		var c = className instanceof RegExp? className : className.toLowerCase(),
			cls = getClasses(dom),
			i = cls.length-1;
		for(; i>=0; i--){

			if( (c instanceof RegExp && c.test(cls[i]) ) || cls[i].toLowerCase() === c){
				cls.splice(i,1);
				if(!(c instanceof RegExp)){
					break;
				}
			}
		}

		dom.setAttribute('class',cls.join(' '));
	}

	function mask(){
		addClass(document.body,'loading');
	}

	function unmask(){
		removeClass(document.body,'loading');
	}

	function getLink(o, relName){
		var l = (o||{}).Links || [],
			i = l.length-1;
		for(;i>=0; i--){
			if(l[i].rel === relName){
				l = l[i].href;
				return l;
			}
		}
		return null;
	}

	function formValidation(){
		var validEmail = (emailRx.test(username.value));

		if(!username.postFix && !validEmail){
			clearForm();
		}

		if(validEmail && emailLastValid !== username.value){
			delete username.postFix;
			emailLastValid = username.value;
			ping();
		}

		submit.disabled = (!validEmail && !username.postFix) || !password.value;
	}

	function clearForm(){
		messageUser();//reset the message
		removeClass(document.body,/.*/);
		rel = {};
		var n = oauth.getElementsByTagName('button'),
			i = n.length-1;
		for(; i>=0; i--){
			oauth.removeChild(n[i]);
		}
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

	function on(dom,event,fn){
		if(dom.addEventListener) {
			dom.addEventListener(event,fn,false);
		}
		else if(dom.attachEvent) {
			dom.attachEvent(event,fn);
		}
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
			username: username.value + (username.postFix || ''),
			password: password.value,
			remember: remember.checked
		};
	}

	function getRedirects(xhr){
		if(xhr){
			return {};
		}

		return {
			success: params['return'],
			failure: appendUrl(loc.href, "failed=true")
		};
	}

	function xhr(){
		return (function () {
			try { return new XMLHttpRequest(); } catch(e){}
			try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch (e) {}
			try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch (e) {}
			try { return new ActiveXObject("Microsoft.XMLHTTP"); } catch (e) {}
			return null;
		})();
	}

	function redirect(){
		location.replace(params['return']);
	}

	function call(url,data,back,forceMethod){
		var x = xhr(),
			u = data? data.username : undefined,
			p = data? data.password : undefined,
			a = p? ('Basic '+btoa(u+':'+p)) : undefined,
			m = forceMethod? forceMethod : data? 'POST':'GET',
			l = host+url,// + "?dc="+(new Date().getTime()),
			t = setTimeout(function(){x.abort();},60000);

		x.open( m, l, true );//, u,p);

		if(a){
			x.setRequestHeader('Authorization',a);
		}
		if(data) {
			x.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		}
		x.withCredentials = true;
		x.setRequestHeader('Accept','application/json');
		x.send(data?toPost(data):undefined);
		x.onreadystatechange = function(){
			if(x.readyState === 4){
				clearTimeout(t);
				if(back){
					var o = null, w;
					try{
						if(x.status === 0 && x.responseText === ''){
							console.error('The request failed. Server up? CORS?\nURL: '+l);
						}
						else {
							o = JSON.parse(x.responseText);
						}
					}
					catch(e){
						console.error(x.responseText, e.stack || e.stacktrace);
					}
					back.call(window, o || x.status );
				}
			}
		}
	}

	function offline(){
		messageUser('You are offline.','offline');
		mask();
		document.getElementById('mask-msg').innerHTML = "";
		setTimeout(function(){ window.location.reload(); },30000);
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
		document.cookie='username=null; expires=Thu, 01-Jan-70 00:00:01 GMT; path=/';

		//reset it.
		document.cookie="username="+encodeURIComponent(username.value) +
				(auth.remember?('; expires='+nextMonth.toGMTString()) : '') + '; path=/';

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

			if(v.rel === 'logon.continue'){
				redirect();
			}

			rel[v.rel] = v.href;

			if(/result/i.test(v.rel)){
				console.log(v.rel, getLink(o,v.rel));
				call(getLink(o,v.rel),getAuth(),function(){
					console.log(arguments);
				});
			}


			addClass(document.body,v.rel.replace(/\./g,'-'));
			console.log('rel=' + v.rel);
			if(hideRel[v.rel]!==true){
				addClass(document.body,'or');
				addButton(v.rel);
			}
		}
	}

	function addButton(rel){
		var b = document.createElement('button');

		b.rel = rel;
		b.setAttribute('type','button');
		b.setAttribute('title',rel);
		addClass(b,rel.replace(/\./g,' '));
		b.innerHTML = rel;

		oauth.appendChild(b);
	}

	function error(msg){
		if(msg){emailLastValid = null;}
		messageUser(msg||'Please try again, there was a problem logging in.','error');
	}

	function messageUser(msg,cls){
		unmask();
		if(cls) { addClass(document.body,cls); }
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
				if((t === 'number' && o !== 204) || (t === 'object' && !o.success) || !o){
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
		e = e || event;
		var t = e.target, rel;
		if(/button/i.test(t.tagName)){
			rel = t.rel;
			loginWithRel(rel,false);
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


	function hackUsername(e){
		e = e || event;
		if(e.keyCode === 13){
			if (!emailRx.test(username.value)){
				username.postFix = '@aops_ghana.nextthought';
				ping();
			}
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
					try{ac.swapCache();}
					catch(e){/*sigh*/}
					window.location.reload();
				} else {
					// Manifest didn't changed. Nothing new to serve.
				}
			}, false);
		}
		catch(e){
			//something bad?
		}
	}

	function onReady(){
		message = document.getElementById('message');
		password = document.getElementById('password');
		username = document.getElementById('username');
		remember = document.getElementById('remember');
		submit = document.getElementById('submit');
		form = document.getElementById('login');
		oauth = document.getElementById('oauth-login');
		setInterval(formValidation,1000);

		originalMessage = message.innerHTML;

		on(username,'keyup',moveFocus);
		on(username,'keydown',hackUsername);
		on(oauth,'click',clickHandler);
		on(form,'submit',submitHandler);


		var i, v, o={}, a = location.search.replace('?','').split("&");
		for(i=0;i<a.length;i++){
			v = a[i].split('=');
			o[decodeURIComponent(v[0])]=decodeURIComponent(v[1]);
		}
		params = o;
		if(o.host){
			host = o.host;
		}
		if(o.failed){
			error();
		}

		a = document.cookie.split(/;\s*/g);
		for(i=0;i<a.length;i++){
			v = a[i].split('=');
			if(v[0]==='username'){
				remember.checked = true;
				username.value = decodeURIComponent(v[1]);
				username.focus();

				hackUsername({keyCode: 13});
			}
		}


		handleCache();
	}

	window.onload = onReady;
}());
