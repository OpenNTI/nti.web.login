(function($) {

	var validation = {},
		url,
		preflighturl,
		profileSchema,
		avatarURLChoices,
		schemaToFieldMap = {
			'first': 'realname',
			'last': 'realname',
			'day': 'birthdate',
			'month': 'birthdate',
			'year': 'birthdate',
			'password_verify': 'password',
			'email_verify': 'email'
		};
		fieldToSchemaMap = {
			'birthdate': 'year',
			'realname': 'first'
		};


	function num(s){return parseInt(s,10);}


	function setupSelectBox(sb){
		var t=-1,o='open',oc='.'+o,ct=clearTimeout,c='.selectbox',ol='ol'+c,d='div'+c,l='disabled',dv='data-value';
		function locked(s){return $(ol,sb||s).attr(l)===l;}
		function show(s){ct(t); locked(s)||$(ol,sb||s).addClass(o);}
		function hide(s){ct(t); locked(s)||$(ol,sb||s).removeClass(o);}
		$(sb||d).click(function(){
			if($(this).parents(c).has(oc).length===0){
				show(this);
			}
		})

			.mouseleave(function(){var e=this;ct(t);t=setTimeout(function(){hide(e);},750);})
			.mouseenter(function(){ct(t);})
			/*
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
				*/
				.find('li').click(function(e){
					var l=$(this),p=l.parent(ol);
					if(l.parents(c).has(oc).length===0){return;}
					hide(l.parents(d));
					p.attr(dv, l.attr(dv));
					p.find('li').removeClass('selected');
					l.addClass('selected');
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


	function disableFields(){
		if (!profileSchema) {
			return;
		}

		$('.field-container').each(function(index, dom){
			//get inputs
			var d = $(dom),
				inp = d.find('input'),
				n = inp.attr('name'),
				mappedName = schemaToFieldMap[n] || n,
				schemaVal = profileSchema[mappedName];

			//special cases:
			if (mappedName === 'Username' || mappedName === 'password') {
				schemaVal = true;
			}

			if (schemaVal){
				d.removeClass('disabled');
			}
			else {
				d.addClass('disabled')
			}
		});
		populateAffiliation();
	}


	function showAvatars(){
		var sec = $('section.avatars'),
			fc = sec.find('.field-container');

		if (!avatarURLChoices || avatarURLChoices.length === 0) {
			//just make sure it's hidden:
			sec.addClass('disabled');
			return;
		}

		//if we have existing avatars, remove and replace them, username may have changed:
		$('a.avatar').remove();

		//unhide avatar stuff
		fc.removeClass('disabled');
		sec.removeClass('disabled');

		//now create spans with avatar images:
		$.each(avatarURLChoices, function(index, u){
			var s = $('<a class="avatar"><img/></a>');
			fc.append(s);
			s.find('img').attr('src', u);
			s.click(function(e){
				e.preventDefault();
				e.stopPropagation();

				//first unselect everything:
				$('a.avatar').removeClass('selected');
				s.addClass('selected');

				validation['avatarURL'] = u;
				checkIt();
				return false;
			});
		});
	}


	function affiliationValidation(){
		var selections = $('.affiliation').find('ol.selectbox'),
			value = [];

		//put affiliation data in the correct order:
		$.each(selections, function(i, s){
			value.push($(s).attr('data-value'));
		});
		value.reverse();

		validate('affiliation',  value.join(','));
	}


	function lockBirthday(){
		$('.month,[name=day],[name=year]').attr('disabled','true').removeAttr('tabindex');
	}


	function birthdayValidation(){
		var bd, pftimer;

		function afterSuccess(){
			disableFields();
			form.addClass('birthday-filled-in');
			if (profileSchema['contact_email']){
				//assume coppa:
				lockBirthday();
			}
		}

		function pf() {
			clearTimeout(pftimer);
			var m = num(month.attr('data-value'))-1,
				d = day.val(),
				y = year.val();

			//do i need to go further?
			if (m === null || !d || !y || y.length < 4){return;}

			//otherwise, make a date:
			bd = new Date(y<1000?NaN:y, m, d);
			if (bd) {
				validate('birthdate', bd, afterSuccess);
			}
		}

		function timer(){
			clearTimeout(pftimer);
			pftimer = setTimeout(pf, 2000);
		}

		var month = $('.month'),
			day = $('[name=day]'),
			year = $('[name=year]'),
			p = month.parents('.field-container'),
			form = $('form');

		$('.month,[name=day],[name=year]').blur(pf).keyup(timer);
	}


	function nameValidation(){
		function pf() {
			var f = firstname.val(),
				l = lastname.val(),
				rn;

			if (f && l) {
				rn = f+' '+l;
				validate('realname', rn);
			}
		}

		var firstname = $('[name=first]'),
			lastname = $('[name=last]'),
			pftimer;


		function timer(){
			clearTimeout(pftimer);
			pftimer = setTimeout(pf, 2000);
		}

		firstname.blur(pf).keyup(timer);
		lastname.blur(pf).keyup(timer);
	}


	function setupValidationListener(field, afterSuccess){
		function pf() {
			validate(field, m.val(), afterSuccess);
		}

		var m = $('input[name='+field+']'),
			pftimer;


		function timer(){
			clearTimeout(pftimer);
			pftimer = setTimeout(pf, 2000);
		}

		m.blur(pf).keyup(timer);
	}


	function emailValidation(){
		function pf(){
			var e = email.val(),
				veri = verify.val();

			p.removeClass('invalid');
			v.removeClass('invalid');

			if (!e || !veri){return;}
			if (e !== veri){
				v.removeClass('invalid valid');
				v.addClass('invalid');
				return;
			}
			validate('email', e);
		}

		var email = $('[name=email]'),
			verify = $('[name=email_verify]'),
			p = email.parents('.field-container'),
			v = verify.parents('.field-container'),
			pftimer;


		function timer(){
			clearTimeout(pftimer);
			pftimer = setTimeout(pf, 2000);
		}

		email.blur(pf).keyup(timer);
		verify.blur(pf).keyup(timer);
	}


	function usernameValidation(){
		setupValidationListener('Username', function(){showAvatars();});
	}


	function optInValidation(){
		var field = 'opt_in_email_communication',
			m = $('input[name='+field+']'),
			p = m.parents('.field-container'),
			pftimer;

		function afterSuccess(){
			if(m[0].checked){p.find('.valid').text('Thanks, we will send you emails.');}
			else {p.find('.valid').text('Okay, no emails for you.');}
		}

		function pf() {
			validate(field, m.val(), afterSuccess);
		}

		function timer(){
			clearTimeout(pftimer);
			pftimer = setTimeout(pf, 2000);
		}

		m.change(pf).keyup(timer);
	}


	function passwordValidation(){
		function pf(){
			var pass = ps.val(),
				veri = verify.val();

			p.removeClass('invalid');
			v.removeClass('invalid');

			if (!pass || !veri){return;}
			if (pass !== veri){
				v.removeClass('invalid valid');
				v.addClass('invalid');
				return;
			}
			validate('password', pass);
		}

		var ps = $('[name=password]'),
			verify = $('[name=password_verify]'),
			p = ps.parents('.field-container'),
			v = verify.parents('.field-container'),
			pftimer;


		function timer(){
			clearTimeout(pftimer);
			pftimer = setTimeout(pf, 2000);
		}

		ps.blur(pf).keyup(timer);
		verify.blur(pf).keyup(timer);
	}


	function ping(){
		$.ajax({
			dataType: 'json',
			url:host+'/dataserver2/logon.ping',
			headers: {Accept:'application/json'},
			type: 'GET'
		}).done(function(data){
			url = getLink(data,'account.create');
			preflighturl = getLink(data,'account.preflight.create');
		}).fail(function(){
			console.error('failed to resolve service url...will retry in 5 seconds');
			setTimeout(ping,5000);
		});
	}


	function post(data){
		var x = $.ajax({
			headers: {Accept:'application/json'},
			url: host+ url,
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


	function preflight(data, success, fail){

	 	function defaultFail(){
			console.log('preflight fail');
		}

		function defaultSuccess(){
			//go ahead and overwrite, no biggy:
			profileSchema = this.ProfileSchema;
			avatarURLChoices = this.AvatarURLChoices;
			//make sure we got everything we needed:
			console.log('preflight success', data);
			checkIt();
		}

		if (!success){success = defaultSuccess;}
		if (!fail){fail = defaultFail;}

		var x = $.ajax({
			headers: {Accept:'application/json'},
			url: host+ preflighturl,
			data: JSON.stringify(data),
			dataType: 'json',
			type: 'POST'
		}).fail(fail).done(success);
	}


	function checkIt(){
		var key, val, o;

		for(key in profileSchema) {
		    val = profileSchema[key];
		    o = validation[key];

			if(val.required && !o) {
				$('a.agree').addClass('disabled');
				return false;
			}
		}

		//check some things we are sure about, just in case:
		if (!validation.Username || !validation.password) {
			$('a.agree').addClass('disabled');
			return false;
		}

		$('a.agree').removeClass('disabled');
		return true;
	}


	function makeIt(e){
		var s,att='shakeit';
		try {
			if(!checkIt()){
				s = $('.field-container:not(.valid):visible').removeClass(att).addClass(att);
				setTimeout(function(){s.removeClass(att);},1300);
			} else {
				post(validation);
			}
		}
		catch(er){
			console.log('whoops...'+er.message);
		}
		e.preventDefault();
		e.stopPropagation();
		return false;
	}


	function parseResponseText(data) {
		if (data && data.responseText) {
			return JSON.parse(data.responseText);
		}
		return null;
	}


	function buildSelect(owner, level, obj) {
		owner.parents('.field-container').removeClass('invalid valid');
		owner.find('[data-level=' +level+']').remove();
		owner.find('[data-level=' +(level+1)+']').remove();
		owner.find('br').remove();

		if (!obj){return;}

		if(level === 2){
			owner.append($('<br/>'));
		}

		var s = $('<div data-level="'+level+'" class="selectbox"></div>'),
			ol = $('<ol class="selectbox" data-value="'+level+'" tabindex="1"></ol>'),
			titles = ['State', 'City', 'School'],
			key, option;

		//Add the title
		ol.append($('<li class="placeholder selected" data-value="'+titles[level]+'">'+titles[level]+'</li>'));


		for (key in obj) {
			if ($.isArray(obj)){key = obj[key];}
			option = $('<li data-value="'+key+'">'+key+'</li>');
			ol.append(option);
		}
		s.append(ol);
		owner.append(s);

		setupSelectBox(s);

		//SETUP EVENTS:
		ol.change(function(){
			if (level < 2) {
				buildSelect(owner, level + 1, obj[ol.attr('data-value')]);
			}
			else {
				affiliationValidation();
			}
		});
	}


	function populateAffiliation(){
		var sec = $('section.affiliations'),
			owner = $('.affiliation');

		if (!profileSchema || !profileSchema.affiliation){
			//just make sure it's hidden:
			sec.addClass('disabled');
			return;
		}

		sec.removeClass('disabled');
		owner.removeClass('disabled');

		owner.parents('.field-container').removeClass('disabled');
		owner.html('');
		$.getJSON('js/school-data.js', function(data){
			var key;
			console.log('school data loaded', data);
			buildSelect(owner, 0, data);
		});
	}


	function makeOneLine(str) {
		if (str.length < 100) {return str;}
		//chop at too chars:
		var result = str.substring(0, 100),
			period = result.lastIndexOf('.');

		if (period > -1 && period > 30) {
			result = result.substring(0, period+1);
		}
		return result;
	}


	function markFieldValidated(fieldName) {
		//see if fieldname is mapped to anything for special circumstances:
		fieldName = fieldToSchemaMap[fieldName] || fieldName;

		//Get the fields we will need to manipulate:
		var m = $('input[name='+fieldName+']'),
			mv = $('input[name='+fieldName+'_verify]'),
			p = m.parents('.field-container'),
			pv = mv ? mv.parents('.field-container') : null;

		if (!p.length){
			//we didn't find anything, see if it's one of those special dynamic things:
 			m = $('.'+fieldName);
			p = m.parents('.field-container');
		}

		p.removeClass('invalid valid');
		p.addClass('valid');

		//also mark verification fields if we see them:
		if (pv.length){
			pv.removeClass('invalid valid');
			pv.addClass('valid');
		}


	}


	function markFieldInvalidated(responseObject) {
		//Get the fields we will need to manipulate:
		var fieldName = responseObject.field,
			m = $('input[name='+fieldName+']'),
			mv = $('input[name='+fieldName+'_verify]'),
			p = m.parents('.field-container'),
			pv = mv ? mv.parents('.field-container') : null;

		p.removeClass('invalid valid');
		p.find('.invalid').text(makeOneLine(responseObject.message));
		p.addClass('invalid');

		if (pv){
			pv.removeClass('invalid valid');
		}
	}


	function validate(fieldName, fieldValue, afterSuccess) {
		function success(data){
			console.log('success', data);

			//field value is validated, put it in the official spot:
			validation[fieldName] = fieldValue;

			//adjust our schema and avatar collection, why not:
			profileSchema = data.ProfileSchema;
			avatarURLChoices = data.AvatarURLChoices;

			//Mark field verified as validated:
			markFieldValidated(fieldName);

			//call aftersuccess if there
			if (afterSuccess){afterSuccess();}

			//check to see if I should enable button:
			checkIt();
		}

		function fail(response){
			console.log('fail', arguments);

			//pull the importiant data out of the response
			var data = parseResponseText(response);

			markFieldInvalidated(data);
		}

		//clone our current validation values and add our new value:
		var packet = $.extend({}, validation);
		packet[fieldName] = fieldValue;

		//preflight:
		console.log('im validating this', packet);
		preflight(packet, success, fail);
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
		optInValidation();

		$('a.agree').click(makeIt);

		$('#signin').attr('href',function(i,at){
			var r = at + location.search;
			return (r !== at) ? r : document.referrer;
		});

		ping();
	});


})(jQuery);
