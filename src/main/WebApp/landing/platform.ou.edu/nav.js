$(function(){
	var ua = navigator.userAgent;
	var uaHack = ua.match(/MSIE\ (\d+)\.\d+/);
	
	if(!uaHack || parseInt(uaHack[1],10) > 10){
		$('html').addClass('pointer-events');
	}
	else if(/gecko/i.test(ua) && !/MSIE/.test(ua)){
		$('html').removeClass('hwaccel');
	}

	$('.subpage controls next,.subpage controls previous').click(function(){

		alert($(this).attr('data-ref'));

	});
	$('.subpage controls close').click(function(){ location.href = './'; });
});
