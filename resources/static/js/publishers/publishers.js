
window.addEventListener('WebComponentsReady', function() {

	$('h3#title').html(localizer.get('publishers'));
	$('<a>',{text: localizer.get('init'), href:'/'+utils.getMainUrl()}).appendTo('.breadcrumbs');
	$('<a>',{text: localizer.get('publishers'),href: '/publishers'}).appendTo('.breadcrumbs');

	let filterObject = customElements.get('table-filter');
	let filter = new filterObject;
	filter.fields = [{name:"name"}, {name:"country"}];
	
	var tableManager = new TableManager('/api/publishers');

	
	tableManager.valueManager = function(item, elem) {
		var retValue = "";
		if(elem.value == 'status') {
				 retValue = localizer.get('statusType.'+item.value);
		}
		else
			retValue = item.value;
		
		return retValue;
	}
	
	tableManager.init('publisher-actions', filter);
});
