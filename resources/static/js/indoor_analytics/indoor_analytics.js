var advertising_ids = [];

window.addEventListener('WebComponentsReady',function() {
	var loadData = {};
	
	$('title').html(localizer.get('indoor_analytics'));
	$('h3#title').html(localizer.get('indoor_analytics'));
	$('<a>',{text: localizer.get('init'), href:utils.getMainUrl()}).appendTo('.breadcrumbs');
	$('<a>',{text: localizer.get('indoor_analytics'),href: '/indoor_analytics'}).appendTo('.breadcrumbs');
	
	$('infinia-select[name="viewBy"]')[0].options = [
		{id:'0', value:localizer.get('day')},
		{id:'1', value:localizer.get('month')},
		{id:'2', value:localizer.get('betweenDates')}
	];
	let date = new Date();
	date.setDate(date.getDate())
	$('date-picker[name="initDate"]')[0].setMaxDate(date);
	$('date-picker[name="endDate"]')[0].setMaxDate(date);
	utils.datesDepending('dateFrom', 'dateTo');
	
	$('infinia-select[name="month"]')[0].setOptions([
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
	]);
	//id: #NotMyPresident
	$('infinia-select[name="year"]')[0].setOptions([
 		{id:'2017', value:'2017'},
 		{id:'2018', value:'2018'},
 	]);

	// Load options infinia-select retailer.
	var componentsPromise = new Promise((resolve, reject) => {
		utils.post("/api/components/selects", JSON.stringify({
			"fields":[
				{
					"id": "0",
					"field":"retailers"
				}
			]
		}), function(retailers) {
			$('infinia-select[name="retailers"]')[0].options = retailers[0].options;
		});
	})
	
	setTimeout(function() {		
		//Select default value 'day'.
		$('infinia-select[name="viewBy"]')[0].setValue('0');
		$('date-picker[name="initDate"]')[0].setValue(new Date().toDateString());
	}, 1000);
});

// Search button.
$('#indoor-analytics-search').on('click', function() {
	
	let loadData = getSearchData();
	$('collapsible-content[title="search"]')[0].collapse();
	$('.data-container').removeClass('hidden');
	if (loadData != null){
	
		utils.lockScreen();
		
		let promises = [];
		

		promises.push(new Promise(function(resolve, reject) {
			
			utils.apiPost('/retailer/home', loadData, function(response) {
				if(!jQuery.isEmptyObject(response)) {			
					
					if(response.uniquePerm)
					$('quantitative-analytical[name="stayInArea"]')[0].setContent(response.uniquePerm.toLocaleString());
					if(response.visitorReturn)
					$('quantitative-analytical[name="returnVisitors"]')[0].setContent(response.visitorReturn.toLocaleString());
					
					if(response.totalReturnDays && response.visitorReturn) {
						var averageReturnTime = Math.round((response.totalReturnDays/response.visitorReturn) * 10) / 10;
						$('quantitative-analytical[name="averageReturnTime"]')[0].setContent(averageReturnTime.toLocaleString());
					}
					if(response.totalTime && response.uniquePerm) {
						var halfTime = Math.round((response.totalTime/response.uniquePerm) * 10) / 10;
						$('quantitative-analytical[name="halfTime"]')[0].setContent(halfTime.toLocaleString());					
						$('quantitative-analytical[name="totalIndividuals"]')[0].setContent(response.uniqueVisitors.toLocaleString());
					}
				}
				
				resolve();
			}, 
			function() { 
				resolve();
			});
		}))
		
		promises.push(new Promise(function(resolve, reject) {	
			// Get analítica cualitativa.	
			utils.apiPost('/retailer/stats', loadData, function(response) {
				
				if(!jQuery.isEmptyObject(response)) {
					if(response.representativity)				
						$('#representativity_analytics').html(response.representativity+'%');
					else
						$('#representativity_analytics').html('0%');
					
					
					//pies here
					drawPies(convertToObjectMain(response), "main-pies-analytics",utils.getPieColors());
					//drawTables(response);
					resolve();
				}
			},
			function() { 
				resolve();
			});
		}))
		
		
		
		  //IAB PSYCHOGRAPHIC AREA (RECYCLED! x2)
    
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
			
		/////////////////////////////////////END DEMO AREA///////
		
		
		
		promises.push(new Promise(function(resolve, reject) {		
			$('#vitalZoneAnalytics-map')[0].init();
			// Get vital zone.
			utils.apiPost('/retailer/stats/_vitalzone', loadData, function(response) {
				if(!jQuery.isEmptyObject(response)) {
					// Load cordenates in vitalZone map.
					response.vitalzone.forEach(function(point) {
						$('infinia-map[name="vitalZoneAnalytics"]')[0].addPoi(point.lat, point.lon, 1000);
					});
				}
				resolve();
			},
			function() {
				resolve();
			});
		}))
		
		
		// Get home place.
		promises.push(new Promise(function(resolve, reject) {	
			$('#homeAnalytics-map')[0].init();
			utils.apiPost('/retailer/stats/_homeplace', loadData, function(response) {
				if(!jQuery.isEmptyObject(response)) {
					// Load cordenates in home map.
					response.homeplace.forEach(function(point) {
						$('infinia-map[name="homeAnalytics"]')[0].addPoi(point.lat, point.lon, 1000);
					});
				}
				resolve();
			},
			function() {
				resolve();
			});
		}))
		
		// Get work place.
		$('#work-map')[0].init();
		utils.apiPost('/retailer/stats/_workplace', loadData, function(response) {
			if(!jQuery.isEmptyObject(response)) {
				// Load cordenates in work map.
				response.workplace.forEach(function(point) {
					$('infinia-map[name="workAnalytics"]')[0].addPoi(point.lat, point.lon, 1000);
				});
			}
		});	
		
		// Get advertising-ids
		utils.apiPost('/retailer/home/ids', loadData, function(response) {
			advertising_ids = response;
		});
		
		Promise.all(promises).then(function(responses) {
			utils.unlockScreen();
		})
	}
});

$('#create-cluster').on('click', function() {
	
	if (advertising_ids != null && advertising_ids.length > 0){
		console.log(advertising_ids);
		
		if(utils.validateRequired('create-cluster-form')){
			
			let config = {
				indoor : advertising_ids
			};
		
			let data = {
				configuration : JSON.stringify(config),
				name : $('input[name="name"]').val(),
				clusterStatus : 'created',
				schedule : 0,
				emrConfig : 'clusterization',
				createDate: new Date().getTime(),
				clusterType : 'CLUSTER'
			};
			utils.lockScreen();
			
			utils.post('/api/clusters', JSON.stringify(data), 
			function(response) {
				if(response.resultCode == 0) {
					if(utils.getURLParam('outdoor')){
						utils.modal("Cluster creado", "El cluster se ha creado correctamente <br><br>"+
								"<a href='/outdoor_analytics'>Volver a clusters</a><br><br>" +
								"<a href='/clusters/" + response.id+ "?outdoor=true'>Editar cluster</a><br><br>");
					}
					else {
						utils.modal("Cluster creado", "El cluster se ha creado correctamente <br><br>"+
							"<a href='/clusters'>Volver a clusters</a><br><br><a href='/clusters/" + response.id+ "'>Editar cluster</a><br><br>");
					}
				}	
				utils.unlockScreen();
			},
			function(response){
				utils.modal("Error", "Ha habido un error en la creación del cluster, reintentarlo en unos minutos <br><br>");
				console.log(response);
				utils.unlockScreen();
			});	
		}
	}
});

$('#download-indoor-csv').on('click',function() {
	
	let data = getSearchData();
	utils.lockScreen();
	utils.apiPost('/retailer/home/csv', data, function(response) {
		utils.writeCSV('Microtargeting data',response);
		utils.unlockScreen();
	})
})



$('.showSelector').on('click', function() {
	$('.showSelector').removeClass('active');
	$(this).addClass('active');				
	let container = $(this).data('section');
	$('div[id$="-container"]').addClass('hidden');
	$('#' + container + '-container').removeClass('hidden');
	
	if(container == 'behavioral_dashboard') {
		$('.homeworkAnalytics').each((index, map)=> {
			map.init();
		});
	}
});

$('infinia-select[name="viewBy"]').on('change', function() {
	if(this.value == '1') {
		$('#field_month').removeClass('hidden');
		$('#field_year').removeClass('hidden');
		$('#field_endDate').addClass('hidden');
		$('#field_initDate').addClass('hidden');
	}
	else if(this.value == '2') {
		$('#field_month').addClass('hidden');
		$('#field_year').addClass('hidden');
		$('#field_endDate').removeClass('hidden');
		$('#field_initDate').removeClass('hidden');
	}
	else {
		$('#field_month').addClass('hidden');
		$('#field_year').addClass('hidden');
		$('#field_endDate').addClass('hidden');
		$('#field_initDate').removeClass('hidden');
	}
});

$('infinia-select[name="retailers"]').on('change', function(e) {
	document.querySelector('infinia-select[name="locations"]').setOptions([]);
	if(this.value) {
		utils.lockScreen();
		utils.post("/api/components/selects", JSON.stringify({
			"fields":[
				{
					"id": this.value,
					"field":"locations"
				}
			]
		}), function(locations) {
			$('infinia-select[name="locations"]')[0].options = locations[0].options;
			utils.unlockScreen();
		});		
	}

});

$('infinia-select[name="locations"]').on('change', function() {
	document.querySelector('infinia-select[name="trackers"]').setOptions([]);
	if(this.value) {
		utils.lockScreen();
		utils.post("/api/components/selects", JSON.stringify({
			"fields":[
				{
					"id": this.value,
					"field":"trackers"
				}
			]
		}), function(locations) {
			$('infinia-select[name="trackers"]')[0].options = locations[0].options;
			utils.unlockScreen();
		});	
	}
});

function convertToObjectMain(response) {
	var arr = [];
	var total;
	
	if(response.age) {
		arr.push({
			name: 'age',
			values: []
		});
		
		total = getTotal(response.age);		
		Object.keys(response.age).forEach(function(key) {
			arr[0].values.push({
				value: key,
				quantity: Math.round((response.age[key]*100/total)*10)/10
			});
		});
	}
	
	if(response.gender) {
		arr.push({
			name: 'gender',
			values: []
		});
		
		total = getTotal(response.gender);
		Object.keys(response.gender).forEach(function(key) {
			arr[1].values.push({
				value: key,
				quantity: Math.round((response.gender[key]*100/total)*10)/10
			});
		});
	}
	
	if(response['income_level']) {
		arr.push({
			name: 'income_level',
			values: []
		});
		
		total = getTotal(response['income_level']);
		Object.keys(response['income_level']).forEach(function(key) {
			arr[2].values.push({
				value: key,
				quantity: Math.round((response['income_level'][key]*100/total)*10)/10
			});
		});
	}
	
	if(response.country) {
		arr.push({
			name: 'country',
			values: []
		});
		
		total = getTotal(response.country);
		Object.keys(response.country).forEach(function(key) {
			arr[3].values.push({
				value: key,
				quantity: Math.round((response.country[key]*100/total)*10)/10
			});
		});
	}
	
	return arr;
}

function drawPies(response, container, color) {
	utils.drawPies(response, container, color);
};

function convertRetailerToOptions(response) {
	var arr = [];
	
	response.forEach(function(elem) {
		arr.push({
			id: elem['id_retailer'],
			value: elem['name']
		});
	});
	
	return arr;
}

function getDaysOfMonth(month) {
	var days = "";
	var m = (Number(month) + 1).toString();
	
	if(m == '4' || m == '6' || m == '9' || m == '11') {
		days = '30';
	}
	else if(m == '1' || m == '3' || m == '5' || m == '7' 
	|| m == '8' || m == '10' || m == '12') {
		days = '31';
	}
	else {
		var year = new Date().getFullYear();
		
		if((year % 4 == 0) && ((year % 100 != 0) || (year % 400 == 0)))
			days = '29';
		else
			days = '28';
	}
	
	return days;
}

function getTotal(values) {
	var total = 0;
	
	Object.keys(values).forEach((key) => {
		total += values[key];
	});
	
	return total;
}

function getSearchData(){
	
	var loadData = {};
	
	// Search type
	if($('infinia-select[name="viewBy"]')[0].value == '0' || $('infinia-select[name="viewBy"]')[0].value == '2') {
		loadData.type = 'day';
	} 
	else if($('infinia-select[name="viewBy"]')[0].value == '1'){
		loadData.type = 'month';
	}
	
	// Entity Type
	if($('infinia-select[name="retailers"]').val()) {
		loadData.level = 'retailer';
		loadData.entityId = $('infinia-select[name="retailers"]')[0].value;
	}
	if($('infinia-select[name="locations"]').val()) {
		loadData.level = 'location';
		loadData.entityId = $('infinia-select[name="locations"]')[0].value;
	}
	if($('infinia-select[name="trackers"]').val()) {
		loadData.level = 'tracker';
		loadData.entityId = $('infinia-select[name="trackers"]')[0].value;
	}
	if(!loadData.entityId) {
		utils.unlockScreen();
		utils.modal("No puede realiza la búsqueda", "Necesita seleccionar al menos un retailer para iniciar la búsqueda.");
		return null;
	}
	
	// from and to.
	if($('infinia-select[name="viewBy"]')[0].value == '0') {
		var daySelected = new Date($('date-picker[name="initDate"]')[0].getValue());
		
		var daySelected_month = ((daySelected.getMonth() + 1) < 10) ? ('0'+(daySelected.getMonth() + 1)) : (daySelected.getMonth() + 1);
		var daySelected_day = (daySelected.getDate() < 10) ? ('0'+daySelected.getDate()) : daySelected.getDate();
		
		loadData.from = daySelected.getFullYear() + '-' + daySelected_month + '-' + daySelected_day + 'T' + '00:00:00';
		loadData.to = daySelected.getFullYear() + '-' + daySelected_month + '-' + daySelected_day + 'T' + '23:59:59';
	}
	else if($('infinia-select[name="viewBy"]')[0].value == '1') {
		//month area
		var day = getDaysOfMonth($('infinia-select[name="month"]')[0].value);
		var month_init = ((Number($('infinia-select[name="month"]')[0].value) + 1) < 10) ? ('0'+(Number($('infinia-select[name="month"]')[0].value) + 1)) : (Number($('infinia-select[name="month"]')[0].value) + 1);
		var year_init = $('infinia-select[name="year"]').val();
		console.log(year_init);
		
		loadData.from = year_init + '-' + month_init + '-' + '01' + 'T' + '00:00:00';
		loadData.to = new Date().getFullYear() + '-' + month_init + '-' + day + 'T' + '23:59:59';
	}
	else if($('infinia-select[name="viewBy"]')[0].value == '2') {
		var initDate = new Date($('date-picker[name="initDate"]')[0].getValue());
		var endDate = new Date($('date-picker[name="endDate"]')[0].getValue());
		var from_month_initDate = ((initDate.getMonth() + 1) < 10 ? ('0'+(initDate.getMonth() + 1)) : (initDate.getMonth() + 1));
		var to_month_endDate = ((endDate.getMonth() + 1) < 10 ? ('0'+(endDate.getMonth() + 1)) : (endDate.getMonth() + 1));
		var from_day_initDate = (initDate.getDate() < 10 ? ('0'+initDate.getDate()) : initDate.getDate()); 
		var to_day_endDate = (endDate.getDate() < 10 ? ('0'+endDate.getDate()) : endDate.getDate());
		
		loadData.from = initDate.getFullYear() + '-' + from_month_initDate + '-' + from_day_initDate + 'T' + '00:00:00';
		loadData.to = endDate.getFullYear() + '-' + to_month_endDate + '-' + to_day_endDate + 'T' + '23:59:59';
	}
	
	return loadData;
}


	function drawTables(response) {
		let divMapping = {categories:"categories_app", apps:"apps", iab_cats:"iab", leiki_cats:"interests"};
		
		Object.keys(response).forEach((key) => {
			
			let div = divMapping[key];
			if(div) {
				total = calculateTotal(response[key]);
				let percents = getPercents(response[key], total);
				let rows = [];
				Object.keys(percents).every((key, index) => {
					if(index > 9 )
						return false;
			 		rows.push({
			 			id:key,
			 			cells:[
			 				{id:0, value:key},{id:1, value:percents[key]}
			 			]
			 		})
			 		return true;
			 	})

				let InfiniaTable = customElements.get('infinia-table');
				let infiniaTable = new InfiniaTable();
				$('#psychographic-'+div).html(infiniaTable);
				infiniaTable.hidePagination();
				infiniaTable.disableSorting();
				infiniaTable.tableColumns = [{id:0, value:localizer.get(div)}, {id:1, value:localizer.get("total")}];
				
				infiniaTable.tableRows = rows;
				
				infiniaTable.disableHeadFixed = true;
				if(rows.length > 0) {
					$('#summary-data').prop(div,rows[0].cells[0].value.replace('&amp;', '&'));	
				}
			}
		})
			
		
	}
	

function calculateTotal(obj) {
	let total = 0;
	Object.keys(obj).forEach((key) => {
		total+= obj[key]
	})
	return total;
}

function getPercents(obj, total) {
	let obj2 = {};
	Object.keys(obj).forEach((key) => {
		let val = Number(obj[key] / total * 100).toFixed(2);
		if(val != 0)
			obj2[key] = val;
	}) 
	return obj2;
}
