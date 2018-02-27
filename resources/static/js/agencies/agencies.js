window.addEventListener('WebComponentsReady', function() {

	$('h3#title').html(localizer.get('agencies'));
	$('<a>',{text: localizer.get('init'), href:'/'+utils.getMainUrl()}).appendTo('.breadcrumbs');
	$('<a>',{text: localizer.get('agencies'),href: '/agencies'}).appendTo('.breadcrumbs');

	var tableManager = new TableManager('/api/agencies');
	
	tableManager.valueManager = function(item, elem) {
		var retValue = "";
		if(elem.value == 'status') {
				 retValue = localizer.get('statusType.'+item.value);
		}
		else
			retValue = item.value;
		
		return retValue;
	}
	
	let filterObject = customElements.get('table-filter');
	let filter = new filterObject;
	filter.fields = [{name:"name"}];
	

	tableManager.init('agency-actions', filter);
});
