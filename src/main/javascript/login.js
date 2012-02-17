$AppConfig = {
	server: {
		host: 'http://localhost:8081'
	}
};

(function(){
	var emailRx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
		username,
		password,
		remember,
		submit,
		form,
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
		var k, string = [];
		for(k in o){
			if(o.hasOwnProperty(k)){
				if(typeof o[k]==='string') {
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

	function xhr(){
		return (function () {
			try { return new XMLHttpRequest(); } catch(e){}
			try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch (e) {}
			try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch (e) {}
			try { return new ActiveXObject("Microsoft.XMLHTTP"); } catch (e) {}
			return null;
		})();
	}

	function call(url,data,back,forceMethod){
		var x = xhr(),
			u = data? data.username : undefined,
			p = data? data.password : undefined,
			a = u? ('Basic '+btoa(u+':'+p)) : undefined,
			t = setTimeout(function(){x.abort();},60000);

		x.open( forceMethod? forceMethod : data? 'POST':'GET',
				host+url,// + "?dc="+(new Date().getTime()),
				true);

		if(a){
			x.setRequestHeader('Authorization',a);
			x.withCredentials = true;
		}
		if(data) {
			x.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		}
		x.send(data?toPost(data):undefined);
		x.onreadystatechange = function(){
			if(x.readyState == 4){
				clearTimeout(t);
				if(back){
					back.call(window, x.status==200 ? JSON.parse(x.responseText): x.status );
				}
			}
		}
	}

	function submitHdlr(e){
		mask();
		try{
			call(ping,null,function(o){
				var pong = getLink(o,'handshake');

				call(pong, getAuth(), function(o){
					var tick = getLink(o,'password');

					call(tick,getAuth(),function(o){

						unmask();
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
		password = document.getElementById('password');
		username = document.getElementById('username');
		remember = document.getElementById('remember');
		submit = document.getElementById('submit');
		form = document.getElementById('login');
		setInterval(formValidation,500);

//		call('/dataserver2/logout');

		on(form,'submit',submitHdlr);

	}
	window.onload = onReady;
}());
