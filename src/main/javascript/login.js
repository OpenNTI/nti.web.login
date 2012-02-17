$AppConfig = {
	server: {
		host: 'http://localhost:8081'
	}
};

(function(){
	var emailRx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
		message,
		username,
		password,
		remember,
		submit,
		form,
		params,
		url = location.href.split(/[\?#]/g)[0],
		host = $AppConfig.server.host,
		ping = '/dataserver2/logon.ping',
		rel = {
			handshake: 'logon.handshake',
			password: 'logon.nti.password'
		};

	function mask(){
		document.body.setAttribute('class','loading');
	}

	function unmask(){
		document.body.setAttribute('class','');
	}

	function getLink(o, relName){
		var l = (o||{}).Links || [],
			i = l.length-1;
		for(;i>=0; i--){
			if(l[i].rel === rel[relName]){
				return l[i].href;
			}
		}
		return null;
	}

	function formValidation(){
		submit.disabled = !(emailRx.test(username.value) && password.value );
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

	function submitHandler(e){
		function error(){
			unmask();
			document.body.setAttribute('class','error');
			message.innerHTML = 'Please try again, there was a problem logging in.';
		}

		mask();
		message.innerHTML = 'Please enter your login information:';
		try{
			call(ping,null,function(o){
				var pong = getLink(o,'handshake');
				if(!pong){
					return error();
				}
				call(pong, getAuth(), function(o){
					var tick = getLink(o,'password');
					if(!tick){
						return error();
					}
					tick += "?" + toPost(getRedirects());

					call(tick,getAuth(),function(o){
						if(!o.success){
							return error();
						}
						document.getElementById('mask-msg').innerHTML = "Redirecting...";
						redirect();
					}, 'GET');
				});
			});
		}
		catch(er){
			console.error(er.stack);
			unmask();
		}
		return stop(e||event);
	}



	function onReady(){
		message = document.getElementById('message');
		password = document.getElementById('password');
		username = document.getElementById('username');
		remember = document.getElementById('remember');
		submit = document.getElementById('submit');
		form = document.getElementById('login');
		setInterval(formValidation,500);

//		call('/dataserver2/logout');

		on(form,'submit',submitHandler());


		var i, v, o={}, a = location.search.replace('?','').split("&");
		for(i=0;i<a.length;i++){
			v = a[i].split('=');
			o[decodeURIComponent(v[0])]=decodeURIComponent(v[1]);
		}
		params = o;

		if(o.host){
			host = $AppConfig.server.host = o.host;
		}
	}
	window.onload = onReady;
}());
