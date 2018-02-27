

window.addEventListener('WebComponentsReady', function() {

	
	$('h3#title, title').html(localizer.get('retailers'));
	$('<a>',{text: localizer.get('init'), href:'/'+utils.getMainUrl()}).appendTo('.breadcrumbs');
	$('<a>',{text: localizer.get('retailers'),href: '/retailers'}).appendTo('.breadcrumbs');

	let filterObject = customElements.get('table-filter');
	let filter = new filterObject;
	filter.fields = [{name:"name"}];
	
	var tableManager = new TableManager('/api/retailers');
	
	tableManager.valueManager = function(item, elem) {
		var retValue = "";
		if(elem.value == 'status') {
				 retValue = localizer.get('statusType.'+item.value);
		}
		else
			retValue = item.value;
		
		return retValue;
	}
	
	tableManager.init('retailer-actions', filter);
	
	

});