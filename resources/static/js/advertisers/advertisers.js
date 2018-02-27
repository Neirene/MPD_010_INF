

window.addEventListener('WebComponentsReady', function() {

	$('h3#title').html(localizer.get('advertisers'));
	$('<a>',{text: localizer.get('init'), href:'/'+utils.getMainUrl()}).appendTo('.breadcrumbs');
	$('<a>',{text: localizer.get('advertisers'),href: '/advertisers'}).appendTo('.breadcrumbs');

	let filterObject = customElements.get('table-filter');
	let filter = new filterObject;
	filter.fields = [{name:"name"}, {name:"agencyName"}, {name:"domain"}];
	
	var tableManager = new TableManager('/api/advertisers');
	
	tableManager.valueManager = function(item, elem) {
		var retValue = "";
		if(elem.value == 'status') {
				 retValue = localizer.get('statusType.'+item.value);
		}
		else if(elem.value == 'iab') {
			var data = utils.getIABData();
			data.forEach((iab) => {
				if(iab.id == item.value) {
					retValue = iab.value;
					return;
				}
			})
			
		}
		else
			retValue = item.value;
		
		return retValue;
	}
	
	tableManager.init('advertiser-actions', filter);
	
	

});