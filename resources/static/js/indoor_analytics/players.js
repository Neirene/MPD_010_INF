
window.addEventListener('WebComponentsReady', function() {

	//Setting breadcrumbs
	$('<a>',{text: localizer.get('init'), href:'/'+utils.getMainUrl()}).appendTo('.breadcrumbs');
	$('<a>',{text: localizer.get('retailers'), href: '/retailers'}).appendTo('.breadcrumbs');
	
	utils.lockScreen();
	utils.get('/api/retailers/' + id_retailer, {}, function(response) {
		$('<a>',{text: response.name, href: '/retailers/'+response.id}).appendTo('.breadcrumbs');
		$('<a>',{text: "Ubicaciones",href: '/retailers/'+response.id+'/locations'}).appendTo('.breadcrumbs');
		utils.get('/api/locations/' + id_location, {}, function(response) {
			$('#title,#location-name-breadcrumb').html(response.name);
			$('<a>',{text: response.name, href: '/locations/' + response.id + '?id_retailer=' + id_retailer}).appendTo('.breadcrumbs');
			$('<a>',{text: localizer.get('players'), href: '/locations/' + id_location + '/players?id_retailer' + id_retailer}).appendTo('.breadcrumbs');
			utils.loadFormData(response);
			utils.unlockScreen();
		});
	});

	let filterObject = customElements.get('table-filter');
	let filter = new filterObject;
	filter.fields = [{name:"name"}];
	
	var tableManager = new TableManager('/api/locations/' + id_location + '/players');
	
	tableManager.valueManager = function(item, elem) {
		var retValue = "";
		if(elem.value == 'status') {
			 retValue = localizer.get('statusType.'+item.value);
		}
		else
			retValue = item.value;
		
		return retValue;
	}
	
	tableManager.init('player-actions', filter);
	tableManager.editUrl = function(e){
		window.location = '/players/' + e.detail + '?id_location=' + id_location + '&id_retailer=' + id_retailer;
	}
});