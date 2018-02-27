window.addEventListener('WebComponentsReady',function() {
	$('title').html(localizer.get('itineraries_retailer'));
	$('h3#title').html(localizer.get('itineraries_retailer'));
	$('<a>',{text: localizer.get('init'), href:utils.getMainUrl()}).appendTo('.breadcrumbs');
	$('<a>',{text: localizer.get('indoor_analytics'),href: '/indoor_analytics'}).appendTo('.breadcrumbs');
	$('<a>',{text: localizer.get('itineraries_retailer'),href: '/indoor_analytics/itineraries_retailer'}).appendTo('.breadcrumbs');
});