

window.addEventListener('WebComponentsReady', function() {

	$('h3#title').html(localizer.get('traffickers'));
	$('<a>',{text: localizer.get('init'), href:'/'+utils.getMainUrl()}).appendTo('.breadcrumbs');
	$('<a>',{text: localizer.get('traffickers'),href: '/traffickers'}).appendTo('.breadcrumbs');

	let filterObject = customElements.get('table-filter');
	let filter = new filterObject;
	filter.fields = [{name:"name"}, {name:"officeName"}, {name:"email"}, {name:"phone"}];
	
	var tableManager = new TableManager('/api/traffickers');
	tableManager.init('trafficker-actions', filter);


});