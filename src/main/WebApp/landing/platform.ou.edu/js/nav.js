$(function(){
	var ua = navigator.userAgent;
	var uaHack = ua.match(/MSIE\ (\d+)\.\d+/);

	if(!uaHack || parseInt(uaHack[1],10) > 10){
		$('html').addClass('pointer-events');
	}
	else if(/gecko/i.test(ua) && !/MSIE/.test(ua)){
		$('html').removeClass('hwaccel');
	}

	function fixOldLinks(){
		var hashToPageMap = (location.hash||'').substr(1).toLowerCase();
		if (hashToPageMap){
			$('a[data-old]').each(function(){
				if (this.getAttribute('data-old').toLowerCase()==hashToPageMap) {
					window.location.replace(this.getAttribute('href'));
				}
			});
		}
	}


	function manageTabs() {
		var tab = (location.hash||'').substr(1).toLowerCase();
		if (!tab) return;

		$('.tabbed-grids [data-type]').removeClass('active');
		$('.tabbed-grids [data-type="'+tab+'"]').addClass('active');

	}

	window.onhashchange = manageTabs;

	manageTabs();

	fixOldLinks();
});
