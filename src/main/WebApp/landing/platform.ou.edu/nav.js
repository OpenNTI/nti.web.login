$(function(){
	
	function stopVideosHack(){

		var c = $(this),
			pr = c.next(),
			p = c.parent();

		if (!pr.length) {
			c.appendTo(p);
		} else {
			c.insertBefore(pr);
		}

	}
	
	function delayedRemove(jQ,name,hide){
		setTimeout(function(){
			jQ.removeClass(name);
			if(hide){
				jQ.hide();
			}
		},1200);
	}
	
	function showPage(){
		$('body').scrollTop(0)
		var view = location.hash.substr(1),
			base = $('#wrapper-all,#footer'),
			direction, current, next;

		$('.subpage:visible iframe').each(stopVideosHack);
		current = $('.subpage:visible').index();

		if(view){
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
		base.show();
	}
	
	$('.subpage controls next').click(function(){
		location.hash = $(this).parents('.subpage').next().attr('id') || '';
	});
	$('.subpage controls previous').click(function(){
		location.hash = $(this).parents('.subpage').prev().attr('id') || '';
	});
	$('.subpage controls close').click(function(){ location.hash=''; });
	
	window.onhashchange = showPage;
	showPage();
});