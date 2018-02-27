



var Common = function(){
	this.slider;
}
var common = new Common();

Common.prototype.initSlider = function(target, controller) {
	let _this = this;
	this.slider = new InfiniaSlider(target);
	this.slider.init();
	if(controller){
		controller = "#"+controller;
	}
	else controller = "";
	$(controller+' .ol-menu-option').on('click', function() {
		if(!$(this).hasClass('inactive')) {
			$(controller+' .ol-menu-option').removeClass('active');
			$(this).addClass('active');
			_this.slider.goTo($(this).data('label'));
		}
	});
}

Common.prototype.breadcrumbLinks = function() {
	$('.section-breadcrumb').find('a').closest('li').on('click', function(e) {
		if($(this).find('a').attr('href'))
			window.location = $(this).find('a').attr('href');
	})
}

map_center = utils.getUserCountryCoordinates();
$(document).ready(function() {
	common.breadcrumbLinks();
	common.stickyHeader();
	setTimeout(() => {$('body').css('visibility', 'visible');}, 300);
})


// sticky header / breadcrumbs 

Common.prototype.stickyHeader = function() {
	
	$(document).scroll(function(){
		
		var shadowContainer = document.querySelector('#header_area').shadowRoot
		var shadowHeader = shadowContainer.lastElementChild
		
		if ($(document).scrollTop() >= $(shadowHeader).outerHeight()) {
			$(shadowHeader).css("margin-bottom", $('.title-section').height() + "px") 
			$('.title-section').addClass("sticky-header");
			$('.new_button').addClass("sticky-buttons");
		}else{
			$('.title-section').removeClass("sticky-header")
			$(shadowHeader).css("margin-bottom", "0px") 
			$('.new_button').removeClass("sticky-buttons");
		}
		
	});
	
	
}
