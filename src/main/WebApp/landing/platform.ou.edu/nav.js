$(function(){
	$('head base').remove();
	$('.courses').appendTo('body');

	var ua = navigator.userAgent;
	var uaHack = ua.match(/MSIE\ (\d+)\.\d+/);
	if(!uaHack || parseInt(uaHack[1],10) > 10){
		$('html').addClass('pointer-events');
	}

	if(/gecko/i.test(ua) && !/MSIE/.test(ua)){
		$('html').removeClass('hwaccel');
	}



	function stopVideosHack(){

		var c = $(this),
			pr = c.next(),
			p = c.parent();

		setTimeout(function(){
			if (!pr.length) {
				c.appendTo(p);
			} else {
				c.insertBefore(pr);
			}
		},750);
	}

	function delayedRemove(jQ,name,hide){
		setTimeout(function(){
			jQ.removeClass(name);
			if(hide){
				jQ.hide();
			}
		},700);
	}


	function handleChange(){
		var view = location.hash.substr(1);
		if(view && $('.subpage#'+view).length) {
			$("html, body").animate({ scrollTop: 0 }, 600);
			setTimeout(showPage,600);
		} else {
			showPage();
		}
	}


	function showPage(){
		// $(window).scrollTop(0);
		var view = location.hash.substr(1),
			base = $('#wrapper-all,#footer'),
			direction, current, next;
		var showMainHack = $('#main'),
		    showAboutHack = $('#about');
			
		$('a#about_btn').html('About').attr('href','#about');

		$('.subpage:visible iframe, .subpage:visible object').each(stopVideosHack);
		current = $('.subpage:visible').index();
		if( view && view === 'about' ) {
			direction = true;

			inDir = direction ? 'Right':'Left';
			outDir = !direction ? 'Right':'Left';


			delayedRemove( $('.subpage:visible').addClass('slideOut'+outDir), 'shown slideOut'+outDir, true);
			base.find(':not(.subpage) * iframe').each(stopVideosHack);

			showMainHack.hide();
			showAboutHack.show();
			showAboutHack.removeClass('hidden');
			$('a#about_btn').html('Home').attr('href','#');
			return;
		}


		if(view && $('.subpage#'+view).length) {
			next = $('#'+view).index();
			direction = (next - current) > 0;

			inDir = direction ? 'Right':'Left';
			outDir = !direction ? 'Right':'Left';



			delayedRemove( $('.subpage:visible').addClass('slideOut'+outDir), 'shown slideOut'+outDir, true);

			base.find(':not(.subpage) * iframe').each(stopVideosHack);

			delayedRemove( base, '', true );
			delayedRemove( $('#'+view).addClass('shown slideIn'+inDir).show(),'slideIn'+inDir);
			return;
		}


		delayedRemove( $('.subpage:visible').addClass('slideOutDown'), 'slideOutDown shown', true);

		showAboutHack.hide();
		showMainHack.show();
		base.show();


		// $('#main, #about').hide();
		// $('#'+view||'main').show();
	}

	$('.subpage controls next').click(function(){
		location.hash = $(this).parents('.subpage').next().attr('id') || $('.subpage').first().attr('id') || '';
	});
	$('.subpage controls previous').click(function(){
		location.hash = $(this).parents('.subpage').prev().attr('id') || $('.subpage').last().attr('id') || '';
	});
	$('.subpage controls close').click(function(){ location.hash=''; });

	window.onhashchange = handleChange;
	showPage();
});
