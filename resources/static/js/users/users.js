window.addEventListener('WebComponentsReady', function() {
	utils.getMainUrl();
	$('h3#title').html(localizer.get('users'));
	$('<a>',{text: localizer.get('init'), href:'/'+utils.getMainUrl()}).appendTo('.breadcrumbs');
	$('<a>',{text: localizer.get('users'),href: '/users'}).appendTo('.breadcrumbs');
	
	let filterObject = customElements.get('table-filter');
	let filter = new filterObject;
	filter.fields = [{name:"username"}, {name: "company"}, {name: "email"}];
	
	var tableManager = new TableManager('/api/users');
	
	tableManager.valueManager = function(item, elem) {
		var retValue = "";

		retValue = item.value;
		
		return retValue;
	}
	
	tableManager.init('users-actions', filter);
});