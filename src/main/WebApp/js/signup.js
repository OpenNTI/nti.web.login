(function($) {

	var validation = {}, url,
		now = new Date(),
		emailRx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	function num(s){return parseInt(s,10);}
	function isDateValid(d){var f='getTime';return d && d[f] && !isNaN( d[f]() );}


	function setupSelectBox(){
		var t=-1,o='open',oc='.'+o,ct=clearTimeout,c='.selectbox',ol='ol'+c,d='div'+c,l='disabled',dv='data-value';
		function locked(s){return $(ol,s).attr(l)===l;}
		function show(s){ct(t); locked(s)||$(ol,s).addClass(o);}
		function hide(s){ct(t); locked(s)||$(ol,s).removeClass(o);}
		$(d).click(function(){if($(this).parents(c).has(oc).length===0){show(this);}})
			.mouseleave(function(){var e=this;ct(t);t=setTimeout(function(){hide(e);},750);})
			.mouseenter(function(){ct(t);})
			.keydown(function(e){
					var t=$(ol,this),v=num(t.attr(dv)),k=e.which,
						u=(k>=37&&k<=38),d=(k>=39&&k<=40),m=t.children('li').length-1;

					v = v+(u?-1:d?1:0);

					if(!v && u){v=m;} else if(!v && d){v=1;}

					if(v){ t.attr(dv, (v>m?1:v)||m).change(); }

					if(k===13){ hide(this); }

					if(k!==9  && !e.altKey && !e.ctrlKey && !e.shiftKey ){
						e.stopPropagation();
						e.preventDefault();
						return false;
					}
				})
				.find('li').click(function(e){
					var l=$(this),p=l.parent(ol);
					if(l.parents(c).has(oc).length===0){return;}
					hide(l.parents(d));
					p.attr(dv, l.val());
					p.change();
					e.stopImmediatePropagation();
					e.stopPropagation();
					e.preventDefault();
					return false;
				});
	}


	function setupNumberFields(){
		function f(e){
			function b(v,a,c){return v>=a && v<=c;}
			//8,9,13 = BACKSPACE,TAB,ENTER
			var k=e.which||13,el=$(this),
				m=String(el.val()||'').length>=num(el.attr('size')),
				a=b(k,37,40),//arrows
				n=b(k,48,57) || b(k,95,105),//numbers
				s = Math.abs(this.selectionStart - this.selectionEnd) !== 0,
				mod=e.altKey||e.ctrlKey||e.shiftKey;

			if((m && n && !s && !mod)||(k!==13 && k!==46 && !b(k,8,9) && !a && !n && !mod)){
				e.stopPropagation();
				e.preventDefault();
				return false;
			}
			
			clearTimeout(t);
			setTimeout(function(){el.change();},500);
		}
		
		var t;
		var e = $('input[data-type="number"]').keydown(f).keypress(f);

		setInterval(function(){
			e.each(function(i,o){
				var p=$(o);
				if(p.val() !== o.lastValue){
					o.lastValue = p.val();
					p.change();
				}
			});
		},5000);
	}


	function lockBirthday(){
		$('.month,[name=day],[name=year]').attr('disabled','true').removeAttr('tabindex');
	}


	function birthdayValidation(){
		function c(){
			function nb(d){return typeof d === 'number' && isFinite(d) && !isNaN(d);}
			var cls = 'birthday-filled-in',
				f = $('form'),
				p = $('.month').parents('.field-container'),
				m = num($('.month').attr('data-value'))-1,
				d = num($('[name=day]').attr('value')),
				y = num($('[name=year]').attr('value')),
				cpa = new Date(now.getFullYear()-13, now.getMonth(), now.getDate()),
				bd;

			f.removeClass(cls+' coppa');
			p.removeClass('valid invalid');
			validation.birthday = false;
			try {
				bd = new Date(y<1000?NaN:y, m, d);				
				
				if(isDateValid(bd) && bd.getDate()===d && bd.getMonth()===m && bd.getFullYear()===y && bd < now){
					p.addClass('valid');
					f.addClass(cls);
					if(bd > cpa){
						f.addClass('coppa');
						validation.pg = true;
						lockBirthday();
					}
					if(!!$('[name=year]:focus').length){
						$('[name=first]').focus();
					}
					validation.birthday = bd;
				}
				else if(y>1000 && nb(y) && nb(d)){
					p.addClass('invalid');
				}
			}
			catch(e){
				//invalid date
			}
			checkIt();
		}
		$('.month,[name=day],[name=year]').change(c);
	}


	function nameValidation(){
		function f(){
			var b = true,s = '';
			p.removeClass('invalid valid');
			name.each(function(i,o){var v=$(o).val();s+=v;b=b&&v!=='';});
			validation.name = false;
			if(s !== ''){
				p.addClass((b?'':'in')+'valid');
				validation.name = b;
			}
			checkIt();
		}

		var name = $('[name=first],[name=last]'),
			p = name.parents('.field-container');
		name.change(f).keyup(f);
	}


	function emailValidation(){
		function t(){
			var m = $(this),
				p = m.parents('.field-container'),
				v = m.val(),
				b = v==='',
				n = m.attr('name');
			validation[n] = v = emailRx.test(v);
			p.removeClass('invalid valid');
			if(!b){
				p.addClass((v?'':'in')+'valid');
			}
			checkIt();
		}
		$('input[type=email]').change(t).keyup(t);
	}


	function usernameValidation(){
		function t(){
			var m = $(this),
				p = m.parents('.field-container'),
				v = m.val(),
				b = v==='',
				n = m.attr('name'),
				pg = validation.pg,//under 13 years old
				f = v.indexOf( $('[name=first]').val().toLowerCase() ) < 0,//v does not contain firstname
				l = v.indexOf( $('[name=last]').val().toLowerCase() ) < 0;//v does not contain lastname

			validation[n] =
			v = ((pg && f && l) || !pg)
					&& v.length>0;

			p.removeClass('invalid valid');
			if(!b){
				p.addClass((v?'':'in')+'valid');
			}
			checkIt();
		}
		$('input[name=username]').change(t).keyup(t);
	}


	function passwordValidation(){
		function t(){
			var m = $(this),
				p = m.parents('.field-container'),
				v = m.val(),
				b = v==='',
				n = m.attr('name');
			validation[n] = v = (v.length > 5);
			p.removeClass('invalid valid');
			if(!b){
				p.addClass((v?'':'in')+'valid');
			}
			checkIt();
		}
		$('input[type=password]').change(t).keyup(t);
	}


	function ping(){
		$.ajax({
			dataType: 'json',
			url:host+'/dataserver2/logon.ping',
			headers: {Accept:'application/json'},
			type: 'GET'
		}).done(function(data){
			url = getLink(data,'account.create');
			validation.url = Boolean(url);
		}).fail(function(){
			console.error('failed to resolve service url...will retry in 5 seconds');
			setTimeout(ping,5000);
		});
	}

	function post(data){
		var x = $.ajax({
			headers: {Accept:'application/json'},
			url: host+url,
			data: JSON.stringify(data),
			dataType: 'json',
			type: 'POST'
		}).fail(function(){
			var j;
			try{
				j = JSON.parse(x.responseText);
				console.log(j);

				if(/realname/i.test(j.field)){
					j.field = 'first';
				}

				$('[name='+ j.field.toLowerCase()+']')
						.parents('.field-container')
						.removeClass('valid')
						.addClass('invalid')
						.find('.line .invalid')
						.html(j.message);
			}
			catch(e){
				alert('We\'re sorry, but there was an unforeseen issue...\n\n'+x.responseText.split(/\n{3}/)[1]);
			}
		}).done(function(data){
			if(data && data.Class === 'User'){
				window.location.replace(returnUrl);
				return;
			}
			console.log(data);
			alert('hmm... o_O that wasn\'t expected...');
		});
	}


	function checkIt(){
		var v=validation;
		v = (v.url && Boolean(v.birthday) && v.email && v.name && v.username && v.password && (!v.pg || v.parentemail));
		if(v){
			$('a.agree').removeClass('disabled');
		}
		else {
			$('a.agree').addClass('disabled');
		}
		return v;
	}


	function buildObj(){
		var v = validation,
			o = {
				birthdate: v.birthday,
				email: $('input[name=email]').val(),
				realname: [$('input[name=first]').val(),$('input[name=last]').val()].join(' '),
				alias: $('input[name=first]').val(),
				Username: $('input[name=username]').val(),
				password: $('input[name=password]').val()
			};

		if(v.pg){
			o.parentEmail = $('input[name=parentemail]').val();
			o.alias = o.Username;
		}

		return o;
	}


	function makeIt(e){
		var s,att='shakeit';
		try {
			if(!checkIt()){
				s = $('.field-container:not(.valid):visible').removeClass(att).addClass(att);
				setTimeout(function(){s.removeClass(att);},1300);
			} else {
				post(buildObj());
			}
		}
		catch(er){
			console.log('whoops...'+er.message);
		}
		e.preventDefault();
		e.stopPropagation();
		return false;
	}


	//onready event
	$(function(){
		setupSelectBox();
		setupNumberFields();
		birthdayValidation();
		nameValidation();
		emailValidation();
		usernameValidation();
		passwordValidation();

		$('a.agree').click(makeIt);

		$('#signin').attr('href',function(i,at){
			var r = at + location.search;
			return (r !== at) ? r : document.referrer;
		});

		ping();
	});


})(jQuery);
