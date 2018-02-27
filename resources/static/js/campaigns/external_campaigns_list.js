

window.addEventListener('WebComponentsReady', function() {
	utils.getMainUrl();
	$('h3#title').html(localizer.get('external_campaigns'));
	$('<a>',{text: localizer.get('init'), href:'/'+utils.getMainUrl()}).appendTo('.breadcrumbs');

	$('<a>',{text: localizer.get('external_campaigns'),href: '/external_campaigns'}).appendTo('.breadcrumbs');


	
	let filterObject = customElements.get('table-filter');
	let filter = new filterObject;

	filter.fields = [{name:"name"} , {name:"startDate", date:true}, {name:"endDate", date:true}];
	
	var tableManager = new TableManager('/api/external_campaigns');

	tableManager.init('external-campaign-actions', filter);
});