$(function(){
	
	function showPage(){
		var view = location.hash.substr(1),
			base = $('#wrapper-all,#footer');
		console.log(view);

		$('.subpage').hide().removeClass('hidden');
		if(view){
			base.hide();
			$('#'+view).show();
			return;
		}
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