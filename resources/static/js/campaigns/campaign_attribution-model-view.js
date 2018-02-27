
window.addEventListener('WebComponentsReady',function() {
	
	
	common.initSlider('slider-campaign-profile', 'profile-breadcrumb-controller');
	
	$('<a>',{text: localizer.get('init'), href:'/'+utils.getMainUrl()}).appendTo('.breadcrumbs');
	$('<a>',{text: localizer.get('campaigns'),href: '/campaigns'}).appendTo('.breadcrumbs');

	utils.get('/api/campaigns/' + id_campaign, {}, function(campaign) {
		$('#title').html(campaign.name);
		$('<a>',{text: campaign.name,href: '/campaigns/'+campaign.id}).appendTo('.breadcrumbs');
		
		$('infinia-tabs')[0].addTab(0,campaign.name, "", "/campaigns/"+id_campaign);
		
		if(campaign.attributionModel) {
			$('infinia-tabs')[0].addTab(4,localizer.get('attribution_model'), "", "/campaigns/"+id_campaign+"/attribution_model");	
			$('infinia-tabs')[0].setActive(4);
		}
	});
	
	
})
