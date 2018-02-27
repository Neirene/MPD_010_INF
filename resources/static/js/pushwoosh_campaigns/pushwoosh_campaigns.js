window.addEventListener('WebComponentsReady', function() {
	utils.getMainUrl();
	
	$('h3#title').html(localizer.get('push_notifications'));
	$('<a>',{text: localizer.get('init'), href:'/'+utils.getMainUrl()}).appendTo('.breadcrumbs');
	$('<a>',{text: localizer.get('pushwoosh_campaigns'),href: '/pushwoosh_campaigns'}).appendTo('.breadcrumbs');
		
	let filterObject = customElements.get('table-filter');
	let filter = new filterObject;
	
	//TODO: Falta por determinar los campos.
	filter.fields = [{name:"name"}, {name:"description"}, {name:"createdAt", date: true}];
	
	var tableManager = new TableManager('/api/pushwoosh_campaigns');
	
	tableManager.valueManager = function(item, elem) {
		var retValue = "";
		if(elem.value == 'status') {
			 retValue = localizer.get('statusType.' + item.value);
		}
		else if(elem.value == "sendingStatus") {
			retValue = localizer.get("sendingStatus." + item.value);
		}
		else
			retValue = item.value;
		
		return retValue;
	}
	
	tableManager.init('pushwoosh_campaigns-actions', filter);
});