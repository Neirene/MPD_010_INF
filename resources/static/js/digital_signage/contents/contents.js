window.addEventListener('WebComponentsReady', function() {	
	
	$('#title, title').html(localizer.get('contents'));
	$('<a>',{text: localizer.get('init'), href:utils.getMainUrl()}).appendTo('.breadcrumbs');
	$('<a>',{text: localizer.get('contents'), href: '/contents'}).appendTo('.breadcrumbs');
	
	let filterObject = customElements.get('table-filter');
	let filter = new filterObject;
	filter.fields = [{name:"name"}];
	
	var tableManager = new TableManager('/api/contents');
	
	tableManager.valueManager = function(item, elem) {
		var retValue = "";
		if(elem.value == 'status') {
				 retValue = localizer.get('statusType.'+item.value);
		}
		else
			retValue = item.value;
		
		return retValue;
	}

	tableManager.init('content-actions', filter);
});