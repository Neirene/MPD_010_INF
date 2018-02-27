$('h3#title').html(localizer.get('outdoor_analytics'));




$('<a>',{text: localizer.get('init'), href:utils.getMainUrl()}).appendTo('.breadcrumbs');
$('<a>',{text: localizer.get(localizer.get('outdoor_analytics')),href: '/outdoor_analytics'}).appendTo('.breadcrumbs');

window.addEventListener('WebComponentsReady',function() {
	
	
	
	
	utils.post("/api/components/selects", JSON.stringify({
		"fields":[
			{
				"id":"1",
				"field":"retailers"
			},
		]
	}), function(data) {
		document.querySelector('paper-typeahead[name="retailers"]').options = data[0].options;
	});
	
	
	$('paper-typeahead[name="month"]')[0].options = [
		{id:'0', value:localizer.get('january')},
		{id:'1', value:localizer.get('february')},
		{id:'2', value:localizer.get('march')},
		{id:'3', value:localizer.get('april')},
		{id:'4', value:localizer.get('may')},
		{id:'5', value:localizer.get('june')},
		{id:'6', value:localizer.get('july')},
		{id:'7', value:localizer.get('august')},
		{id:'8', value:localizer.get('september')},
		{id:'9', value:localizer.get('october')},
		{id:'10', value:localizer.get('november')},
		{id:'11', value:localizer.get('december')}
	];

	
	
	$('paper-typeahead[name="circuit"]')[0].options = [
		{id:'10', value:'Noche'},
		{id:'10', value:'Bares'}
	];
	
	$('#outdoor-search').on('click', function() {
		$('#data-container').removeClass('hidden');
	
		$('collapsible-content')[0].collapse();
		utils.lockScreen();
		
		utils.get('/api/clusters/5a8f4e4746e0fb000a3927d5/outdoor', {}, (response) => {
			if(response.totalImpacts > 0) 
				$('quantitative-analytical[name="totalImpacts"]')[0].setContent(response.totalImpacts.toLocaleString());
			
			if(response.avarageFrequency > 0) 
				$('quantitative-analytical[name="avarageFrequency"]')[0].setContent(response.avarageFrequency.toLocaleString());
		})
	
		//Pie charts statistics
		utils.apiGet('/cluster/5a8f4e4746e0fb000a3927d5', {}, function(response) {
			
			data = response;
			
			let total = Number(response.total);
			if(!isNaN(total)) {
				$('.demographic-total').html(total.toLocaleString())
				
				if($('quantitative-analytical[name="totalUsersImpacted"]').length > 0)
				$('quantitative-analytical[name="totalUsersImpacted"]')[0].setContent(total.toLocaleString());
			}
			
			var properties = data.properties;
			$.map(properties, (prop) => {
				$.map(prop.values, (val) => {
					$('input[name="' + val.toString().replace(/"/g, '') + '"]').val(val.quantity);
				});
			});
			utils.drawPies(response.properties, "main-pies-container", utils.getPieColors());
			
			drawTopSummary(response.properties);
			utils.unlockScreen();
		})
		
		/*GET CATEGORIES*/
		utils.get("/api/clusters/5a8f4e4746e0fb000a3927d5/psychographic/categories", {}, function(response) {
			utils.drawBulletGraph('categories',response.weights) 

			if(response && response.max) $('#summary-data').prop("categories_app",response.max.replace('&amp;', '&'));	

			//$('#psychographic-categories_app').append('<span style="font-style: italic;">Excluidas las categorías más frecuentes</span>');
		})
		
		/*GET IAB*/
		utils.get("/api/clusters/5a8f4e4746e0fb000a3927d5/psychographic/iab", {}, function(response) {
			utils.drawBulletGraph('iab',response.weights) 
			if(response && response.max) $('#summary-data').prop("iab",response.max.replace('&amp;', '&'));	


		})
		
		/*GET APPS*/
		utils.get("/api/clusters/5a8f4e4746e0fb000a3927d5/psychographic/apps", {}, function(response) {
			utils.drawBulletGraph('apps',response.weights) 
			if(response && response.max) $('#summary-data').prop("apps",response.max.replace('&amp;', '&'));	


		})
		
		/*GET KEYWORDS*/
		utils.get("/api/clusters/5a8f4e4746e0fb000a3927d5/psychographic/keywords", {}, function(response) {
			utils.drawBulletGraph('keywords',response.weights) 
			if(response && response.max) $('#summary-data').prop("interests",response.max.replace('&amp;', '&'));	
		})
		
		
		//Apps
		utils.apiGet("/cluster/5a8f4e4746e0fb000a3927d5/_iab", {}, function(response) {
			var total = calculateTotal(response);
			
			// Set '%' to categories.
			Object.keys(response).forEach(function(key) {
				var quantity = response[key];				
				var percent = ((quantity*100)/total);
				
				response[key] = Math.round(percent*100)/100;
			});
			
			// Load TOP 7.
			var top = getTop(response);
			
			//drawTable('iab',top);
			//utils.drawBulletGraph('iab',top) 
		})
		
		
		
		//Apps
		utils.apiGet("/cluster/5a8f4e4746e0fb000a3927d5/_interests", {}, function(response) {
			var total = calculateTotal(response);
			
			// Set '%' to categories.
			Object.keys(response).forEach(function(key) {
				var quantity = response[key];				
				var percent = ((quantity*100)/total);
				
				response[key] = Math.round(percent*100)/100;
			});
			
			// Load TOP 7.
			var top = getTop(response);
			
			//drawTable('interests',top);
			//utils.drawBulletGraph('interests',top) 
		})
		
		
		
	})
	
	$('infinia-tabs').on('tabSelected', function(e) {
		if(e.detail == 2){
			$('profile-map').each((index, elem) => {
				elem.mapId = '5a8d38314cedfd00079d6c8e';
				elem.mapType = "cluster";
				elem.init();
			})
		}
	})
})




function drawTopSummary(data) {
	if (data){
		data.forEach((elem) => {
			let max = 0;
			let top;
			elem.values.forEach((val) => {
				if(val.quantity > max) {
					max = val.quantity;
					top = val.value;
				}
			})
			
			let text = elem.name == "income_level" ? localizer.get('income.'+top) : localizer.get(top);
			
			$('#summary-data').prop(elem.name,text);
		})
	}
}

