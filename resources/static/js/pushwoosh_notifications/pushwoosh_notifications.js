window.addEventListener('WebComponentsReady', function() {
	utils.getMainUrl();
	
	utils.get('/api/pushwoosh_campaigns/' + idPushwooshCampaign, {}, function(response) {
		$('<a>',{text: localizer.get('init'), href: utils.getMainUrl()}).appendTo('.breadcrumbs');
		$('#title').html(response.name);
		$('infinia-tabs')[0].addTab(0,response.name, "", '/pushwoosh_campaigns/'+response.id);
		$('infinia-tabs')[0].setActive(1);
		$('<a>',{text: "Campañas pushwoosh", href: "/pushwoosh_campaigns"}).appendTo(".breadcrumbs");
		$('<a>',{text: response.name,href: '/pushwoosh_campaigns/'+response.id}).appendTo('.breadcrumbs');
		$('<a>',{text: "Notificaciones pushwoosh", href: '/pushwoosh_campaigns/'+ response.id + 
		'/pushwoosh_notifications'}).appendTo('.breadcrumbs');
	});
	
	let filterObject = customElements.get('table-filter');
	let filter = new filterObject;
	filter.fields = [{name:"content"}, {name:"ignoreUserTimezone"}];
	
	var tableManager = new TableManager('/api/pushwoosh_campaigns/' + idPushwooshCampaign + '/pushwoosh_notifications');
	
	tableManager.valueManager = function(item, elem) {
		var retValue = "";
		
		if(elem.value == 'ignoreUserTimezone') {			
			retValue = localizer.get('ignoreUserTimezone.'+item.value);
		}
		else if(elem.value == "sendingStatus") {
			retValue = localizer.get("sendingStatus." + item.value);
		}
		else
			retValue = item.value;
		
		return retValue;
	};
	
	
	tableManager.init('pushwoosh_notifications-actions', filter);
	tableManager.disableDownload();
	tableManager.hidePagination();
	tableManager.disableRowClick();
	tableManager.editUrl = function(e){
		window.location = '/pushwoosh_notifications/' + e.detail + '?idPushwooshCampaign=' + idPushwooshCampaign;
	};	
});