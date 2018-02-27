

window.addEventListener('WebComponentsReady', function() {
	utils.getMainUrl();
	$('h3#title').html(localizer.get('campaigns'));
	$('<a>',{text: localizer.get('init'), href:'/'+utils.getMainUrl()}).appendTo('.breadcrumbs');
	$('<a>',{text: localizer.get('campaigns'),href: '/campaigns_ds'}).appendTo('.breadcrumbs');

	
	let filterObject = customElements.get('table-filter');
	let filter = new filterObject;
	filter.fields = [{name:"name"} , {name:"resellerName"}, {name:"advertiserName"}, {name:"startDate", date:true}, {name:"endDate", date:true}];
	
	var tableManager = new TableManager('/api/campaigns_ds');
	
	tableManager.valueManager = function(item, elem) {
		var retValue = "";
		if(elem.value == 'dsStatus') {
				 retValue = localizer.get('dsStatusValues.'+item.value);
		}
		else
			retValue = item.value;
		
		return retValue;
	}
	
	tableManager.setErrorColumn(5);
	tableManager.init('campaign_ds-actions', filter);
});