$AppConfig = {
	server: {
		host: 'http://localhost:8081'
	}
};

(function(){
	var emailRx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
		emailLastValid,
		message,
		username,
		password,
		remember,
		submit,
		form,
		oauth,
		params,
		url = location.href.split(/[\?#]/g)[0],
		host = $AppConfig.server.host,
		rel = {};

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
				return l[i].href;
			}
		}
		return null;
	}

	function formValidation(){
		var validEmail = (emailRx.test(username.value));

		if(!validEmail){
			clearForm();
		}

		if(validEmail && emailLastValid !== username.value){
			emailLastValid = username.value;
			ping();
		}

		submit.disabled = !validEmail || !password.value;
	}

	function clearForm(){
		removeClass(document.body,/logon.+/i);
		removeClass(document.body,'or');
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
			username: username.value,
			password: password.value,
			remember: remember.checked
		};
	}

	function getRedirects(){
		var s = url.split('/'),
			f = s.slice();

		s.splice(-1,1,'success.json');
		f.splice(-1,1,'failure.json');

		return {
			success: s.join('/'),
			failure: f.join('/')
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
			a = u? ('Basic '+btoa(u+':'+p)) : undefined,
			t = setTimeout(function(){x.abort();},60000);

		x.open( forceMethod? forceMethod : data? 'POST':'GET',
				host+url,// + "?dc="+(new Date().getTime()),
				true, u,p);

		if(a){
			x.setRequestHeader('Authorization',a);
			x.withCredentials = true;
		}
		if(data) {
			x.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		}
		x.setRequestHeader('Accept','application/json');
		x.send(data?toPost(data):undefined);
		x.onreadystatechange = function(){
			if(x.readyState == 4){
				clearTimeout(t);
				if(back){
					var o = null;
					try{
						o = JSON.parse(x.responseText);
					}
					catch(e){
						console.log(x.responseText);
					}
					back.call(window, x.status==200 ? o: x.status );
				}
			}
		}
	}

	function ping(){
		call('/dataserver2/logon.ping',null,pong);
	}

	function pong(o){
		var auth = getAuth(),
			link = getLink(o,'logon.handshake'),
			nextMonth = new Date(new Date().getTime()+(1000*60*60*24*31)); //31 days;

		if(!link){
			error();
			return;
		}

		//clear it everytime... just incase they change their mind about 'remember me'
		document.cookie='username=null; expires=Thu, 01-Jan-70 00:00:01 GMT; path=/';

		//reset it.
		document.cookie="username="+encodeURIComponent(auth.username) +
				(auth.remember?('; expires='+nextMonth.toGMTString()) : '') + '; path=/';

		call(link,auth,handshake);
	}

	function handshake(o){
		var links = (o||{}).Links || [],
			i = links.length-1,v;
		clearForm();
		for(;i>=0; i--){
			v = links[i];
			rel[v.rel] = v.href;

			addClass(document.body,v.rel.replace(/\./g,'-'));
			if(v.rel!=='logon.nti.password'){
				addClass(document.body,'or');
				addButton(v.rel);
			}
		}
	}

	function addButton(rel){
		var b = document.createElement('button');

		b.rel = rel;
		addClass(b,rel.replace(/\./g,'-'));
		b.innerHTML = '<span>'+rel+'</span>';

		oauth.appendChild(b);
	}

	function error(){
		unmask();
		addClass(document.body,'error');
		message.innerHTML = 'Please try again, there was a problem logging in.';
	}

	function loginWithRel(r,xhr){
		mask();
		message.innerHTML = 'Please enter your login information:';

		try{
			var url = rel[r];

			url += (url.indexOf('?') === -1? "?":"&") + toPost(getRedirects());

			if(!xhr){
				location.replace(url);
				document.getElementById('mask-msg').innerHTML = "Redirecting...";
				return;
			}

			call(url, getAuth(), function(o){
				if(!o.success){
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
			console.log('act on', rel);
			loginWithRel(rel,false);
		}
	}

	function moveFocus(e){
		e = e || event;
		if(e.keyCode === 13){
			stop(e);
			console.log('focus logic here...');
			password.focus();
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
		setInterval(formValidation,500);

		on(username,'keyup',moveFocus);
		on(oauth,'click',clickHandler);
		on(form,'submit',submitHandler);
		username.focus();


		var i, v, o={}, a = location.search.replace('?','').split("&");
		for(i=0;i<a.length;i++){
			v = a[i].split('=');
			o[decodeURIComponent(v[0])]=decodeURIComponent(v[1]);
		}
		params = o;
		if(o.host){
			host = $AppConfig.server.host = o.host;
		}

		a = document.cookie.split(/;\s*/g);
		for(i=0;i<a.length;i++){
			v = a[i].split('=');
			if(v[0]==='username'){
				remember.checked = true;
				username.value = decodeURIComponent(v[1]);
				password.focus();
			}
		}
	}

	window.onload = onReady;
}());
