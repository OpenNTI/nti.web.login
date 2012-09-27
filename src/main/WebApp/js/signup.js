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
		passwordVerified = false;
		schoolList = [];


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
				oth = d.find('div[data-name]'),
				n = inp.attr('name') || oth.attr('data-name'),
				mappedName = schemaToFieldMap[n] || n,
				schemaVal = profileSchema[mappedName];

			if(profileSchema.role) {
				if(schemaVal && (schemaVal.required || mappedName === 'birthdate' || mappedName === 'realname' || mappedName === 'password')) {
					d.addClass('required');
				}
				else {
					d.removeClass('required');
				}

				//special cases:
				if (mappedName === 'Username' || mappedName === 'password') {
					schemaVal = true;
				}

				if (schemaVal){
					d.removeClass('disabled');
				}
				else {
					d.addClass('disabled');
				}
			}
			else {
				if(schemaVal === undefined){
					d.removeClass('required');
					d.addClass('disabled');
				}
				else if(schemaVal && (schemaVal.required || mappedName === 'email' || mappedName === 'realname' || mappedName === 'password')) {
					d.addClass('required');
				}
				else {
					d.removeClass('required');
				}
			}

		});

		//show optional section
		$('section.optionals').removeClass('disabled');
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
			s.find('img').attr('src', u.replace('www.gravatar.com','secure.gravatar.com').replace('http:','https:'));
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

		//select avatar 1 by default
		$('a.avatar').first().addClass('selected');
	}


	function affiliationValidation(){
		var field = 'affiliation',
			inp = $('input[name='+field+']'),
			fc = inp.parents('.field-container'),
			cont = fc.find('div.affiliation-dropdown-container'),
			ol = cont.find('ol'),
			me = this;

		//load the data initially:
		$.getJSON('js/school-data.json', function(data){
			me.schoolList = data;
		});

		function liClicked(e){
			setVal(e.currentTarget.textContent);
		}


		function setVal(v){
			ol.find('li').remove();
			if (!v) {
				//no selection, assume what is in the field
				v = inp.val();
			}
			else {
				inp.val(v);
			}
			validate(field, v);
		}


		function buildDropdown(possibleResults) {
			var i, v, lastClass='', li, max = 20;

			//remove oldies
			ol.find('li').remove();
			if (possibleResults && possibleResults.length) {
				if (possibleResults.length < max){ max = possibleResults.length;}
				for (i = 0; i < max; i++){
					if (i === max-1){lastClass = ' last';}
					v = possibleResults[i];
					li = $('<li class="affiliation-choice'+lastClass+'">'+v+'</li>');
					li.click(liClicked);
					ol.append(li);
				}
			}
		}


		//NOTE the approach here is to turn each term
		//into a regex and loop over them basically anding
		//the matches.  We could get fancy and build up
		//a giant regex that handles all the possible permutations
		//of the terms but its not clear that it would be more performant
		//than just doing the straightforward thing
		function getMatches(s) {
			if (!s){return [];}
			if(inp.val().length === 0){return [];}
			var i, j, goodMatch, results = [],
				escapeRe = /[\-\[\]{}()*+?.,\\\^$|#\s]/g,
				terms = s.split(/\s/),
				regexes = [];
			
			//Build up our regex from our terms
			for(i=0; i < terms.length; i++){
				regexes.push(new RegExp(terms[i].replace(escapeRe, "\\$&"), 'i'));
			}

		    for (i=0; i < me.schoolList.length; i++) {
				goodMatch = true;
				for(j=0; j < regexes.length; j++){
					if(!regexes[j].test(me.schoolList[i])){
						goodMatch = false;
						break;
					}
				}
				if(goodMatch){
					results.push(me.schoolList[i]);
				}
			}

		   	return results;
		}

		function scroll(){
			if (!ol.find('li.selected').length){return;}

			var sel = ol.find('li.selected'),
				selHeight = sel.height(),
				contHeight = cont.height(),
				scrollTop = cont.scrollTop(),
				scrollBottom = contHeight + scrollTop,
				selTop = sel.position().top + scrollTop,
				selBottom = selTop + selHeight;

			if (selTop < scrollTop){
				scrollTop = selTop;
			}
			else if (selBottom > scrollBottom ){
				scrollTop = selBottom - contHeight;
			}
			else {
				return;
			}
			cont.scrollTop(scrollTop);
		}

		function scrollDown(){
			var sel = ol.find('li.selected');

			sel[0].scrollIntoView(false);
		}

		function up(event){
			var currentlySelected = ol.find('li.selected');
			ol.find('li').removeClass('selected');
			if (event.keyCode === 40) {
				//down
				if (currentlySelected.length) {
					currentlySelected.next().addClass('selected');
				}
				else {ol.find('li').first().addClass('selected');}
				scroll();
			}
			else if (event.keyCode === 38) {
				//up
				if (currentlySelected.length){
					currentlySelected.prev().addClass('selected');
				}
				scroll();
			}
			else if (event.keyCode === 13 || event.keyCode === 39) {
				if (currentlySelected.length){
					setVal(currentlySelected.text());
				}
				else{setVal();}
			}
			else {
				var possibleResults = getMatches(inp.val());
				buildDropdown(possibleResults);
			}
		}

		function blur(){
			setTimeout(function(){
				ol.find('li').remove();
			}, 400);
			validate(field, inp.val());
		}

		inp.keyup(up);
		inp.blur(blur);
	}


	function lockBirthday(){
		$('.month,[name=day],[name=year]').attr('disabled','true').removeAttr('tabindex');
        $('a.continue.birthday').remove();
	}


	function birthdayValidation(){
		var bd, pftimer;

		function afterSuccess(){
			disableFields();
			form.addClass('birthday-filled-in');
			//if (profileSchema['contact_email']){
				//assume coppa:
                //aways lock once BD is picked. for now.
				lockBirthday();
			//}
		}

		function afterFail(){
			form.removeClass('birthday-filled-in');
			$('section.optionals').addClass('disabled');
		}

		function isDateValid(){
			var m = num(month.attr('data-value'))-1,
				d = num(day.val()),
				y = num(year.val());

			function invalidate(){
				//apply invalids:
				p.removeClass('valid').addClass('invalid');
				p.find('.invalid').html('That doesn\'t look right.');
				afterFail();
			}

			//do i need to go further?
			if (!d || !y || y < 1000){
				return false;
			}

			//otherwise, make a date:
			bd = new Date(y<1000?NaN:y, m, d);
			if (bd && !isNaN(bd.getTime()) && bd.getFullYear() === y && bd.getMonth() === m && bd.getDate() === d) {
				return true;
			}

			invalidate();
			return false;
		}

		function up(){
			if (isDateValid()){
				clearTimeout(pftimer);
				if (bd || validation.birthdate) {
					validate('birthdate', bd, afterSuccess, afterFail);
				}
			}
		}

		var month = $('.month'),
			day = $('[name=day]'),
			year = $('[name=year]'),
			p = month.parents('.field-container'),
			form = $('form');

        $('a.continue.birthday').click(up);
	}


	function participatesValidation(){
		var yes = $('#participates_in_mathcounts');


		function f(e){
			validate('participates_in_mathcounts', e.currentTarget.checked);
		}

		yes.change(f);
	}


	function roleValidation(){
		var ol = $('ol.role');

		function pf(){
			var val = ol.attr('data-value');
			validate('role', val);
		}

		ol.change(pf);
	}


	function nameValidation(){
		function pf() {
			var f = firstname.val(),
				l = lastname.val(),
				rn;


            if (validation.realname && (!f || !l)){validate('realname', '');}
            else{
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


	function setupValidationListener(field, afterSuccess, afterFail){
		function pf() {
			//try to validate if theres a field value, or you have previously validated:
			if (m.val() || validation[field]){
				validate(field, m.val(), afterSuccess, afterFail);
			}
		}

		var m = $('input[name='+field+']'),
			pftimer;


		function timer(){
			clearTimeout(pftimer);
			pftimer = setTimeout(pf, 2000);
		}

		m.blur(pf).keyup(timer);
	}


	function contactEmailValidation() {
		setupValidationListener('contact_email');
	}


	function emailValidation(){
		setupValidationListener('email');
	}


	function usernameValidation(){
		var u = $('input[name=Username]');
		var e = $('input[name=email]'),
			efc = e.parents('.field-container');

		setupValidationListener('Username', function(){showAvatars();});

		//some little logic to disable email when there's an @ in a username, since
		//the server will take control of setting the email at that point.
		function up(){
			return; //this does nothing yet...
			if (u.val().indexOf('@') > -1) {
				efc.addClass('disabled');
			}
			else {
				efc.removeClass('disabled');
			}
		}

		u.keyup(up);
	}


	function optInValidation(){
		var field = 'opt_in_email_communication',
			m = $('input[name='+field+']'),
			p = m.parents('.field-container'),
			pftimer;

		function afterSuccess(){
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
		function pf(event){
			var pass = ps.val(),
				veri = verify.val();

			p.removeClass('invalid');

			if (!pass){
				p.removeClass('invalid valid');
				p.addClass('invalid');
			}

			if (pass !== veri && veri.trim()){
				v.removeClass('invalid valid');
				v.addClass('invalid');
				checkIt();
				return;
			}

			//TODO right now the server seems perfectly happy
			//to allow empty passwords or passwords that are only
			//whitespace.  Prevent that here
			if(!pass.trim()){
				checkIt();
				return;
			}

			function updateVerify(){
				//FIXME We could just not mark verify fields by default
				//The server doesn't tell us about them so it seems
				//weird to do them there anyway.  thats a more global change
				//than I am comfortable making right now so lets try this

				v.removeClass('invalid valid');
				if(!veri.trim()){
					return;
				}

				v.addClass(pass !== veri ? 'invalid' : 'valid');
				checkIt();
			}

			validate('password', pass, updateVerify, updateVerify);
		}

		var ps = $('[name=password]'),
			verify = $('[name=password_verify]'),
			p = ps.parents('.field-container'),
			v = verify.parents('.field-container'),
			pftimer;


		function timer(event){
			clearTimeout(pftimer);
			if(event.type === 'keyup' && event.keyCode === 9 /*tab key*/){
				return;
			}

			pftimer = setTimeout(pf(event), 500);
		}

		ps.blur(pf).keyup(timer);
		verify.blur(pf).keyup(timer);
	}

	function couldNotConnectToServer(){
		console.error('failed to resolve service url..');
		$('.content').html('<h1>Sorry, unable to connect to the server, try again</h1>');
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

			//find out if we need an initial mathcounts role choice:
			installMathcountsChoice();
		}).fail(function(){
			couldNotConnectToServer();
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


	function preflight(data, success, fail, always){

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
			url: host + preflighturl,
			data: JSON.stringify(data),
			dataType: 'json',
			type: 'POST'
		}).fail(fail).done(success).always(always);
	}


	function checkIt(){
		var key, val, o,
		ps = $('[name=password]'),
		verify = $('[name=password_verify]');

		for(key in profileSchema) {
			if(profileSchema.hasOwnProperty(key)){
				val = profileSchema[key];
				o = validation[key];

				if(val.required  && !o) {
						$('a.agree').addClass('disabled');
						console.log('setting checkIt button to disabled, field ' + key + ' is required');
						return false;
				}
			}
		}

		if(!ps.val().trim() || ps.val() !== verify.val()){
			$('a.agree').addClass('disabled');
			console.log('setting checkIt button to disabled, field ' + key + ' is required');
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
				if (validation.Username && validation.Username.indexOf('@') > -1) {
					console.log('username has an @, not passing email');
					delete validation.email;
				}
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
		if (!responseObject){return;}
		//Get the fields we will need to manipulate:
		var fieldName = fieldToSchemaMap[responseObject.field] || responseObject.field,
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


	function validate(fieldName, fieldValue, afterSuccess, afterFail) {
		function success(data){
			console.log('success', data);

			//adjust our schema and avatar collection, why not:
			profileSchema = data.ProfileSchema;
			avatarURLChoices = data.AvatarURLChoices;

			if (fieldName) {
				//field value is validated, put it in the official spot:
				validation[fieldName] = fieldValue;

				//Mark field verified as validated:
				markFieldValidated(fieldName);

				//check to see if I should enable button:
				checkIt();
			}

			//call aftersuccess if there
			if (afterSuccess){afterSuccess(data);}
		}

		function fail(response){
			console.log('fail', arguments);

			//failure, remove the value from the validation field:
			delete validation[fieldName];

			//pull the importiant data out of the response
			var data = parseResponseText(response);

			markFieldInvalidated(data);

			//check to see if I should enable/disable button:
			checkIt();

			if (afterFail){afterFail(data);}
		}

		//clone our current validation values and add our new value:
		var packet = $.extend({}, validation);
		if(fieldName) {
			packet[fieldName] = fieldValue;
		}

		preflight(packet, success, fail);
        //preflight:
        alert('im validating this' + JSON.stringify(packet) + ' to ' + preflighturl);
    }


	function installMathcountsChoice(){
		function makeSureRoleIsHidden(){
			//role is hidden, birthday is shown:
			$('section.mathcounts-role').addClass('disabled');
			$('section.birthday').removeClass('disabled');
		}

		function showRole(){
			//role is shown, birthday is hidden:
			$('section.mathcounts-role').removeClass('disabled');
			$('section.birthday').addClass('disabled');
			$('.content .createAccountTitle').addClass('disabled');
		}

		function success(data){
			if(data.ProfileSchema && data.ProfileSchema.role) {
				console.log('Mathcounts role detected, showing role selection.');
			 	setTimeout(function(){
					 //console.log('Inside the timeout for rolepicker');
					 showRole();
				 }, 100);
				return;
			}
			makeSureRoleIsHidden();
			generalAdditionalConfig();
		}

		function fail(){
			//failure?  Assume hidden role:
			makeSureRoleIsHidden();
			couldNotConnectToServer();
		}


		//send empty packet just to get schema back:
		validate(null, null, success, fail, function(){alert('always ' + JSON.stringify(arguments));});
	}


	function mathcountsRoleHandler(){
		var choices = $('div.choice'),
			cont = $('a.continue'),
			form = $('form'),
			bd = new Date(0); //earliest possible

		function afterSuccess(){
			disableFields();
			form.addClass('birthday-filled-in');
		}

		function afterFail(){
			form.removeClass('birthday-filled-in');
		}

		function go(){
			var val = $('div.choice.selected').attr('data-value');
			validation.role = val;
			if (val === 'Student') {
				//show birthday next:
				$('section.birthday').removeClass('disabled');
				$('section.birthday').show();
			}
			else {
				//non student selected, just validate a date:
				validate('birthdate', bd, afterSuccess, afterFail);
			}
			$('section.mathcounts-role').addClass('disabled');
			$('h1').removeClass('disabled');
			if (validation.role === 'Teacher') {
				$('div.teacher-note').removeClass('disabled');
				$('div.teacher-note').removeClass('disabled');
			}
		}

		function roleChanged(evt){
			var choice = $(evt.currentTarget);

			choices.removeClass('selected');
			choice.addClass('selected');
			cont.removeClass('disabled');
		}

		choices.click(roleChanged);
		cont.click(go);
	}


	function generalAdditionalConfig(){
		var form = $('form'), x = form.find('.birthday'), pq, opts;
		//Hidden by default
		if(x.length > 0){
			$(x[0]).addClass('disabled');
			$(x).hide();
		}

		if(!profileSchema.role) {
			//Set flag to get the account info
			disableFields();
			form.addClass('birthday-filled-in');

			//Enable default option
			pq = $('section.optionals');
			opts = pq.find('.field-container');
			opts.each(function(i){
				var t = $(opts[i]),
					inp = t.find('input'),
					n = inp.attr('name'),
					def = 'opt_in_email_communication';
				if(n !== def) { t.addClass('disabled'); }
			});

			//show optional section
			pq.removeClass('disabled');
		}
	}

	//onready event
	$(function(){
		setupSelectBox();
		setupNumberFields();
		birthdayValidation();
		nameValidation();
		emailValidation();
		contactEmailValidation();
		usernameValidation();
		passwordValidation();
		optInValidation();
		participatesValidation();
		roleValidation();
		mathcountsRoleHandler();
		affiliationValidation();

		$('a.agree').click(makeIt);

		$('#signin').attr('href',function(i,at){
			var r = at + location.search;
			return (r !== at) ? r : document.referrer;
		});

		ping();

		$('input').focus(function(){
			$(this).parent('div[data-title]').addClass('has-focus');
		}).blur(function(){
			$(this).parent('div[data-title]').removeClass('has-focus');
		});
	});


})(jQuery);
