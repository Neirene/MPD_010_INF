

window.addEventListener('WebComponentsReady', function() {	
	
	//Setting breadcrumbs and title
	$('#title, title').html(localizer.get('creatives'));
	$('<a>',{text: localizer.get('init'), href:'/'+utils.getMainUrl()}).appendTo('.breadcrumbs');
	$('<a>',{text: localizer.get('creatives'),href: '/creatives'}).appendTo('.breadcrumbs');
	
	$('#new-creative').on('click', function(e) {
		$(this).next()[0].open();
	})
	
	let filterObject = customElements.get('table-filter');
	let filter = new filterObject;
	filter.fields = [{name:"name"}, {name:"advertiserName"}];
	
	var tableManager = new TableManager('/api/creatives');
	tableManager.init('creative-actions', filter);
	tableManager.disableRowClick();
})