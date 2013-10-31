$(function(){
	var locationBase = (location+'').split('#')[0];
	
	// $('head base').remove(); //don't remove, IE can't handel it.
	$('.courses').appendTo('body');
	$('a[href^="#"]').each(function(){
		var a = $(this),
			href = a.attr('href'),
			base = href.split('#')[0];
			a.attr('href', href.replace(base,locationBase));
	});

	var ua = navigator.userAgent;
	var uaHack = ua.match(/MSIE\ (\d+)\.\d+/);
	if(!uaHack || parseInt(uaHack[1],10) > 10){
		$('html').addClass('pointer-events');
	}

	if(/gecko/i.test(ua) && !/MSIE/.test(ua)){
		$('html').removeClass('hwaccel');
	}



	function stopVideos(){
		var player = $(this).is('object') ? this : $(this).parent('div.kWidgetIframeContainer')[0];
		if (player.sendNotification) { 
			player.sendNotification('doPause');
		}
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
		if(view && $('.subpage#'+view).length && $("html, body").scrollTop() !== 0) {
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
			
		$('a#about_btn').html('About').attr('href',locationBase+'#about');

		$('iframe[id^=kaltura_player]:visible, object[id^=kaltura_player]:visible').each(stopVideos);
		
		current = $('.subpage:visible').index();

		
		if( view && view === 'about' ) {
			direction = true;

			inDir = direction ? 'Right':'Left';
			outDir = !direction ? 'Right':'Left';


			delayedRemove( $('.subpage:visible').addClass('slideOut'+outDir), 'shown slideOut'+outDir, true);
		


			showMainHack.hide();
			showAboutHack.show();
			showAboutHack.removeClass('hidden');
			$('a#about_btn').html('Home').attr('href',locationBase+'#');
			return;
		}


		if(view && $('.subpage#'+view).length) {
			next = $('#'+view).index();
			direction = (next - current) > 0;

			inDir = direction ? 'Right':'Left';
			outDir = !direction ? 'Right':'Left';


			delayedRemove( $('.subpage:visible').addClass('slideOut'+outDir), 'shown slideOut'+outDir, true);


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
