$(function(){
	var ua = navigator.userAgent;
	var uaHack = ua.match(/MSIE\ (\d+)\.\d+/);
	
	if(!uaHack || parseInt(uaHack[1],10) > 10){
		$('html').addClass('pointer-events');
	}
	else if(/gecko/i.test(ua) && !/MSIE/.test(ua)){
		$('html').removeClass('hwaccel');
	}

	$('.subpage controls next').click(function(){

	});
	$('.subpage controls previous').click(function(){

	});
	$('.subpage controls close').click(function(){ location.href('./'); });
});
