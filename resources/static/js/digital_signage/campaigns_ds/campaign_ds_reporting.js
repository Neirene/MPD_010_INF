window.addEventListener('WebComponentsReady',function() {

	// HEADING AREA
	
	$('<a>',{text: localizer.get('init'), href:'/'+utils.getMainUrl()}).appendTo('.breadcrumbs');
	$('<a>',{text: localizer.get('campaigns'),href: '/campaigns'}).appendTo('.breadcrumbs');
	
	
	utils.get('/api/campaigns_ds/' + id_campaign, {}, function(campaign) {

		$('<a>',{text: campaign.name,href: '/campaigns_ds/'+campaign.id}).appendTo('.breadcrumbs');
		$('#title').html(campaign.name);

	});
	
	//GRAPH AREA
	

	
    var dataIncome = [
              	  ['','Bajo', 'Medio-bajo', 'Medio', 'Medio-alto', 'Alto', { role: 'annotation' } ],
              	  ['Actual', 10, 24, 20, 32, 14, ''],
              	  ['Proyectado', 16, 22, 23, 30, 9, '']
              	]
	
	
    var dataAges = [
	  ['', '>12', '12-17', '18-25', '26-40', '41-55',
	   '>55', { role: 'annotation' } ],
	  ['Actual', 1 ,10, 24, 20, 32, 13, ''],
	  ['Proyectado', 2 ,16, 22, 23, 30, 7, '']
	]
    
    var dataGender = [
              	  ['', 'Hombres', 'Mujeres', { role: 'annotation' } ],
              	  ['Actual', 20, 80, ''],
              	  ['Proyectado', 80, 20, '']
              	]
    
    
    drawBars(dataGender, "efficiency-charts", localizer.get('genderDistribution'),  true)
    drawBars(dataAges, "efficiency-charts", localizer.get('agesDistribution'),  true)
    drawBars(dataIncome, "efficiency-charts", localizer.get('incomeDistribution'),  true)
    

	
    
    
    function drawBars(response, container, name, isStacked) {
    	
        let BarChart = customElements.get('bar-chart');
		let newBar = new BarChart();
		
		$("#" + container).append('<h3>'+name+'</h3>')
		$("#" + container).append(newBar)
    	newBar.setData(response);
    	newBar.graphTitle = name;


    	
    	newBar.drawChart();
    	
    	
    }
    
    
    
    
    
    
    
    //IAB PSYCHOGRAPHIC AREA (RECYCLED!)
    
	/*GET CATEGORIES*/
	utils.get("/api/clusters/5a906f8046e0fb000a3928e0/psychographic/categories", {}, function(response) {
		utils.drawBulletGraph('categories',response.weights) 

		if(response && response.max) $('#summary-data').prop("categories_app",response.max.replace('&amp;', '&'));	

		//$('#psychographic-categories_app').append('<span style="font-style: italic;">Excluidas las categorías más frecuentes</span>');
	})
	
	/*GET IAB*/
	utils.get("/api/clusters/5a906f8046e0fb000a3928e0/psychographic/iab", {}, function(response) {	
			utils.drawBulletGraph('iab',response.weights)	 
		if(response && response.max) $('#summary-data').prop("iab",response.max.replace('&amp;', '&'));	


	})
	
	/*GET APPS*/
	utils.get("/api/clusters/5a906f8046e0fb000a3928e0/psychographic/apps", {}, function(response) {
		utils.drawBulletGraph('apps',response.weights) 
		if(response && response.max) $('#summary-data').prop("apps",response.max.replace('&amp;', '&'));	


	})
	
	/*GET KEYWORDS*/
	utils.get("/api/clusters/5a906f8046e0fb000a3928e0/psychographic/keywords", {}, function(response) {
		utils.drawBulletGraph('keywords',response.weights) 

	})
	

	
	$('infinia-tabs').on('tabSelected', function(e) {
		$('profile-map').each((index, elem) => {
				elem.mapId = '5a8ffeca46e0fb000a392855';
				elem.mapType = "cluster";
				elem.init();
			})
	})
	
	
	//utils.lockScreen();
	/*
	$('#startDate').prop('placeholder', localizer.get('startDate'));
	$('#endDate').prop('placeholder', localizer.get('endDate'));
	utils.datesDepending('startDate', 'endDate');
	
	$('<a>',{text: localizer.get('init'), href:'/'+utils.getMainUrl()}).appendTo('.breadcrumbs');
	$('<a>',{text: localizer.get('campaigns'),href: '/campaigns'}).appendTo('.breadcrumbs');
	
	let endCampaign = "";
	let startCampaign = "";
	
	
	utils.get('/api/campaigns_ds/' + id_campaign, {}, function(campaign) {

		$('<a>',{text: campaign.name,href: '/campaigns_ds/'+campaign.id}).appendTo('.breadcrumbs');
		$('#title').html(campaign.name);
		$('infinia-tabs')[0].addTab(0, campaign.name, "", "/campaigns_ds/"+id_campaign);
		$('infinia-tabs')[0].setActive(2);
		utils.addCampaignPaymentTabs(campaign, $('infinia-tabs')[0]);
		
		getCampaignReport(tableManagerPerformance, campaign.endDate, campaign.startDate);
		
		utils.unlockScreen();
		
	});
	
	$('#startDate, #endDate').on('dateSelected', function() {
		let endDate =  $('#endDate')[0].getValue();
		if(endDate) {
			let d = new Date(endDate);
			d.setDate(d.getDate() + 1);
			endDate = d.getTime();
		}
		else endDate = endCampaign;

		let startDate = $('#startDate')[0].getValue();
		if(startDate) {
			let d = new Date(startDate);
			d.setDate(d.getDate() - 1);
			startDate = d.getTime();
		}
		else startDate = startCampaign;
		utils.lockScreen();
		getCampaignReport(tableManagerPerformance, startDate, endDate);
	})
});	
	
function getCampaignReport(tableManager, startDate, endDate) {

	utils.get('/api/campaigns_ds/' + id_campaign, {}, function(campaign) {
		
	});
	*/
	
	
});
