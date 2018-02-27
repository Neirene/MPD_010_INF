

window.addEventListener('WebComponentsReady', function() {
	utils.getMainUrl();
	$('h3#title').html(localizer.get('campaigns'));
	$('<a>',{text: localizer.get('init'), href:'/'+utils.getMainUrl()}).appendTo('.breadcrumbs');
	$('<a>',{text: localizer.get('campaigns'),href: '/campaigns'}).appendTo('.breadcrumbs');

	
	let filterObject = customElements.get('table-filter');
	let filter = new filterObject;
	filter.fields = [{name:"name"} , {name:"resellerName"}, {name:"agencyName"}, {name:"advertiserName"}, {name:"startDate", date:true}, {name:"endDate", date:true}];
	
	var tableManager = new TableManager('/api/campaigns');
	
	tableManager.valueManager = function(item, elem) {
		var retValue = "";
		if(elem.value == 'dspStatus') {
				 retValue = localizer.get('dspStatusValues.'+item.value);
		}
		else
			retValue = item.value;
		
		return retValue;
	}
	
	tableManager.setErrorColumn(6);
	tableManager.init('campaign-actions', filter);
});