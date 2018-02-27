window.addEventListener('WebComponentsReady',function() {
	var loadData = {};
	
	$('title').html(localizer.get('statistics_retailer'));
	$('h3#title').html(localizer.get('statistics_retailer'));
	$('<a>',{text: localizer.get('init'), href:utils.getMainUrl()}).appendTo('.breadcrumbs');
	$('<a>',{text: localizer.get('indoor_analytics'), href: '/indoor_analytics'}).appendTo('.breadcrumbs');
	$('<a>',{text: localizer.get('statistics_retailer'), href: '/indoor_analytics/statistics_retailer'}).appendTo('.breadcrumbs');
	
	
	$('infinia-tabs')[0].active = 1;
	$('infinia-select[name="viewBy"]')[0].options = [
		{id:'0', value:localizer.get('month')},
		{id:'1', value:localizer.get('betweenDates')}
	];
	
	$('infinia-select[name="initMonth"]')[0].setOptions([
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
	
	$('infinia-select[name="endMonth"]')[0].setOptions([
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
	
	$('infinia-select[name="viewType"]')[0].options = [
		{id: '0', value: localizer.get('day')},
		{id: '1', value: localizer.get('month')}
	];
	
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
		//Select default value 'month'.
		$('infinia-select[name="viewBy"]')[0].setValue('0');		
	}, 1000);
});

$('.showSelector').on('click', function() {
	$('.showSelector').removeClass('active');
	$(this).addClass('active');				
	let container = $(this).data('section');
	$('div[id$="-container"]').addClass('hidden');
	$('#' + container + '-container').removeClass('hidden');
	
	if(container == 'behavioral') {
		$('.homeworkStatistics').each((index, map)=> {
			map.init();
		});
	}
});

$('infinia-select[name="viewBy"]').on('change', function() {
	if(this.value == '0') {
		$('#field_month_init').removeClass('hidden');
		$('#field_month_end').removeClass('hidden');
		$('#field_endDate').addClass('hidden');
		$('#field_initDate').addClass('hidden');
	}
	else {
		$('#field_month_init').addClass('hidden');
		$('#field_month_end').addClass('hidden');
		$('#field_endDate').removeClass('hidden');
		$('#field_initDate').removeClass('hidden');
		let date = new Date();
		date.setDate(date.getDate())
		$('date-picker[name="initDate"]')[0].setMaxDate(date);
		$('date-picker[name="endDate"]')[0].setMaxDate(date);
		utils.datesDepending('dateFrom', 'dateTo');
	}
});

utils.datesDepending('initDate', 'endDate');

$('infinia-select[name="retailers"]').on('change', function() {
	document.querySelector('infinia-select[name="locations"]').setOptions([]);
	if(this.value) {
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


$('#download-indoor-stats-csv').on('click',function() {
	
	let data = getSearchData();
	utils.lockScreen();
	utils.apiPost('/retailer/statistics/csv', data, function(response) {
		utils.writeCSV('Retailer statistics',response);
		utils.unlockScreen();
	})
})

$('#statistics-search').on('click', function() {
	
	
	utils.lockScreen();
	
	
	loadData = getSearchData();
	
	//Load contents.
	
	$('.data-container').removeClass('hidden');
	$('collapsible-content[title="search"]')[0].collapse();
	
	//Get analítica cuantitativa.
	utils.apiPost('/retailer/statistics', loadData, function(response) {
		if(!jQuery.isEmptyObject(response)) {
			var objectToLoad = {
				'uniquePerm': {
					name: 'uniquePerm',
					title: 'Permanencia en área',
					data: [
						['Fecha', 'Visitantes']
					]
				},
				'visitorReturn': {
					name: 'visitorReturn',
					title: 'Retorno de visitantes',
					data: [
						['Fecha', 'Visitantes']
					]
				},
				'totalReturnDays': {
					name: 'totalReturnDays',
					title: 'Tiempo medio de retorno',
					data: [
						['Fecha', 'Días']
					]
				},
				'totalTime': {
					name: 'totalTime',
					title: 'Tiempo medio',
					data: [
						['Fecha', 'Minutos']
					]
				},
				'uniqueVisitors': {
					name: 'uniqueVisitors',
					title: 'Individuos totales',
					data: [
							['Fecha', 'Visitantes']
						]
				}
			};
			
			response.forEach(function(elem) {
				if(elem.uniquePerm) {
					objectToLoad.uniquePerm.data.push([elem.date, elem.uniquePerm]);
				}
				
				if(elem.visitorReturn) {
					objectToLoad.visitorReturn.data.push([elem.date, elem.visitorReturn]);
				}
				
				if(elem.totalReturnDays) {
					objectToLoad.totalReturnDays.data.push([elem.date, elem.totalReturnDays]);
				}
				
				if(elem.totalTime) {
					objectToLoad.totalTime.data.push([elem.date, elem.totalTime]);
				}
				
				if(elem.uniqueVisitors) {
					objectToLoad.uniqueVisitors.data.push([elem.date, elem.uniqueVisitors]);
				}				
			});
			
			if(response.representativity)				
				$('#representativity_statistics').html(response.representativity+'%');
			else
				$('#representativity_statistics').html('0%');
			
			setLineCharts(objectToLoad);
			
			utils.unlockScreen();
		}
		else
			clearLineChartsCuantitative();
	});
	
	// Get demographic.
	utils.apiPost('/retailer/statsAgg', loadData, function(response) {
		if(!jQuery.isEmptyObject(response)) {
			var objectToLoad = {
				'age': {
					name: 'age',
					title: 'Edad',
					data: [
						['Fecha', '<12', '12-17', '18-25', '26-40', '40-55', '55+']
					]
				},
				'gender': {
					name: 'gender',
					title: 'Sexo',
					data: [
						['Fecha', 'Hombre', 'Mujer']
					]
				},
				'income_level': {
					name: 'income_level',
					title: 'Nivel socioeconómico',
					data: [
						['Fecha', 'Bajo', 'Medio-Bajo', 'Medio', 'Medio-Alto', 'Alto']
					]
				},
				'country': {
					name: 'country',
					title: 'Nacionalidad',
					data: [
						['Fecha', 'Nacionales', 'Extranjeros']
					]
				}
			};
			
			Object.keys(response).forEach(function(key) {
				if(key == "age") {										
					Object.keys(response[key]).forEach(function(key2) {
						var data = [key2.substring(1), 0, 0, 0, 0, 0, 0];
						
						Object.keys(response[key][key2]).forEach(function(key3) {
							switch(key3) {
								case '<12':
									data[1] = response[key][key2][key3];
									break;
								
								case '12-17':
									data[2] = response[key][key2][key3];
									break;
									
								case '18-25':
									data[3] = response[key][key2][key3];
									break;
									
								case '26-40':
									data[4] = response[key][key2][key3];
									break;
									
								case '40-55':
									data[5] = response[key][key2][key3];
									break;
									
								case '>55':
									data[6] = response[key][key2][key3];
									break;
							}
						});
						
						objectToLoad.age.data.push(data);
					});					
				}
				
				if(key == "gender") {									
					Object.keys(response[key]).forEach(function(key2) {
						var data = [key2.substring(1), 0, 0];
						
						Object.keys(response[key][key2]).forEach(function(key3) {
							switch(key3) {
								case 'male':
									data[1] = response[key][key2][key3];
									break;
								
								case 'female':
									data[2] = response[key][key2][key3];
									break;
							}
						});
						
						objectToLoad.gender.data.push(data);
					});
				}
				
				if(key == "income_level") {					
					Object.keys(response[key]).forEach(function(key2) {
						var data = [key2.substring(1), 0, 0, 0, 0, 0];
						
						Object.keys(response[key][key2]).forEach(function(key3) {
							switch(key3) {
								case 'income_E':
									data[1] = response[key][key2][key3];
									break;
								
								case 'income_D':
									data[2] = response[key][key2][key3];
									break;
									
								case 'income_C':
									data[3] = response[key][key2][key3];
									break;
									
								case 'income_B':
									data[4] = response[key][key2][key3];
									break;
									
								case 'income_A':
									data[5] = response[key][key2][key3];
									break;
							}
						});
						
						objectToLoad['income_level'].data.push(data);
					});										
				}
				
				if(key == "country") {
					Object.keys(response[key]).forEach(function(key2) {
						var data = [key2.substring(1), 0, 0];
						
						Object.keys(response[key][key2]).forEach(function(key3) {
							switch(key3) {
								case 'es':
									data[1] = response[key][key2][key3];
									break;
								
								case 'otros':
									data[2] = response[key][key2][key3];
									break;
							}
						});
						
						objectToLoad.country.data.push(data);
					});					
				}
			});
			
			setLineCharts(objectToLoad);
		}
		else {
			clearLineChartsDemographic();
		}
	});
	
	// Get vital zone.
	utils.apiPost('/retailer/stats/_vitalzone', loadData, function(response) {
		if(!jQuery.isEmptyObject(response)) {
			// Load coordinates in vitalZone map.
			response.vitalzone.forEach(function(point) {
				$('infinia-map[name="vitalZoneStatistics"]')[0].addPoi(point.lat, point.lon, 1000);
			});
		}				
	});
	
	// Get home place.
	utils.apiPost('/retailer/stats/_homeplace', loadData, function(response) {
		if(!jQuery.isEmptyObject(response)) {
			// Load coordinates in home map.
			response.homeplace.forEach(function(point) {
				$('infinia-map[name="homeStatistics"]')[0].addPoi(point.lat, point.lon, 1000);
			});
		}
	});
	
	// Get work place.
	utils.apiPost('/retailer/stats/_workplace', loadData, function(response) {
		if(!jQuery.isEmptyObject(response)) {
			// Load coordinates in work map.
			response.workplace.forEach(function(point) {
				$('infinia-map[name="workStatistics"]')[0].addPoi(point.lat, point.lon, 1000);
			});
		}
	});		
});

// Functions
function convertRetailerToOptions(response) {
	var arr = [];
	
	response.forEach(function(elem) {
		arr.push({
			id: elem['id_retailer'],
			value: elem['name']
		});
	});
	
	utils.unlockScreen();
	
	return arr;
}

function convertLocationToOptions(response) {
	var arr = [];
	
	response.forEach(function(elem) {
		arr.push({
			id: elem['id_location'],
			value: elem['name']
		});
	});
	
	utils.unlockScreen();
	
	return arr;
}

function convertTrackersToOptions(response) {
	var arr = [];
	
	response.forEach(function(elem) {
		arr.push({
			id: elem['id_tracker'],
			value: elem['name']
		});
	});
	
	utils.unlockScreen();
	
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

function setLineCharts(data) {
	Object.keys(data).forEach(function(key) {
		var obj = data[key];
		
		$('#'+obj.name+'-lineChart').empty();
		const lineChart = window.customElements.get('line-chart');
		let chart = new lineChart();
		chart.id = obj.name + '-chart';
		chart.setData(obj.data);
		chart.setTitle(obj.title);
		
		let div = document.createElement('div');
		div.className="mt20";
		div.append(chart);
		$('#'+obj.name+'-lineChart').append(div);
		chart.drawChart();
	});		
}

function clearLineChartsCuantitative() {
	$('#uniquePerm-container').empty();
	$('#uniquePerm-container').append('<paper-spinner active="active"></paper-spinner>');
	
	$('#totalTime-container').empty();
	$('#totalTime-container').append('<paper-spinner active="active"></paper-spinner>');
	
	$('#visitorReturn-container').empty();
	$('#visitorReturn-container').append('<paper-spinner active="active"></paper-spinner>');
	
	$('#totalReturnDays-container').empty();
	$('#totalReturnDays-container').append('<paper-spinner active="active"></paper-spinner>');
	
	$('#uniqueVisitors-container').empty();
	$('#uniqueVisitors-container').append('<paper-spinner active="active"></paper-spinner>');
}

function clearLineChartsDemographic() {
	$('#age-container').empty();
	$('#age-container').append('<paper-spinner active="active"></paper-spinner>');
	
	$('#gender-container').empty();
	$('#gender-container').append('<paper-spinner active="active"></paper-spinner>');
	
	$('#income_level-container').empty();
	$('#income_level-container').append('<paper-spinner active="active"></paper-spinner>');
	
	$('#country-container').empty();
	$('#contry-container').append('<paper-spinner active="active"></paper-spinner>');
}


function getSearchData()  {
	loadData = {};
	
	
	loadData.ranged = 'true';
	
	if($('infinia-select[name="viewType"]')[0].value && $('infinia-select[name="viewType"]')[0].value == '0') {
		loadData.type = 'day';
	}
	else if($('infinia-select[name="viewType"]')[0].value && $('infinia-select[name="viewType"]')[0].value == '1') {
		loadData.type = 'month';
	}
	else {
		utils.unlockScreen();
		utils.modal("No puede realiza la búsqueda", "Necesita seleccionar el tipo de búsqueda, 'día' o 'mes'.");
		return;
	}
	
	if($('infinia-select[name="retailers"]')[0].value) {
		loadData.level = 'retailer';
		loadData.entityId = $('infinia-select[name="retailers"]')[0].value;
	}
	else if($('infinia-select[name="locations"]')[0].value) {
		loadData.level = 'location';
		loadData.entityId = $('infinia-select[name="locations"]')[0].value;
	}
	else if($('infinia-select[name="trackers"]')[0].value) {
		loadData.level = 'tracker';
		loadData.entityId = $('infinia-select[name="trackers"]')[0].value;
	}
	else {
		utils.unlockScreen();
		utils.modal("No puede realiza la búsqueda", "Necesita seleccionar al menos un retailer para iniciar la búsqueda.");
		return;
	}
	
	
	
	// from and to.
	if($('infinia-select[name="viewBy"]')[0].value == '0') {
		if($('infinia-select[name="initMonth"]')[0].value && $('infinia-select[name="endMonth"]')[0].value) {
			var day = getDaysOfMonth($('infinia-select[name="endMonth"]')[0].value);
			var from_month_init = ((Number($('infinia-select[name="initMonth"]')[0].value) + 1) < 10) ? ('0'+(Number($('infinia-select[name="initMonth"]')[0].value) + 1)) : (Number($('infinia-select[name="initMonth"]')[0].value) + 1);
			var to_month_end = ((Number($('infinia-select[name="endMonth"]')[0].value) + 1) < 10) ? ('0'+(Number($('infinia-select[name="endMonth"]')[0].value) + 1)) : (Number($('infinia-select[name="endMonth"]')[0].value) + 1)
			
			loadData.from = new Date().getFullYear() + '-' + from_month_init + '-' + '01' + 'T' + '00:00:00';
			loadData.to = new Date().getFullYear() + '-' + to_month_end + '-' + ((day < 10) ? ('0'+day) : day) + 'T' + '23:59:59';
		}
		else {
			utils.unlockScreen();
			utils.modal("No puede realiza la búsqueda", "Necesita seleccionar el mes de inicio y el mes final.");
			return;
		}
	}
	else if($('infinia-select[name="viewBy"]')[0].value == '1') {
		if($('infinia-select[name="initDate"]')[0].value && $('infinia-select[name="endDate"]')[0].value) {
			var initDate = new Date($('date-picker[name="initDate"]')[0].getValue());
			var endDate = new Date($('date-picker[name="endDate"]')[0].getValue());
			var from_month_initDate = ((initDate.getMonth() + 1) < 10 ? ('0'+(initDate.getMonth() + 1)) : (initDate.getMonth() + 1));
			var to_month_endDate = ((endDate.getMonth() + 1) < 10 ? ('0'+(endDate.getMonth() + 1)) : (endDate.getMonth() + 1));
			var from_day_initDate = (initDate.getDate() < 10 ? ('0'+initDate.getDate()) : initDate.getDate()); 
			var to_day_endDate = (endDate.getDate() < 10 ? ('0'+endDate.getDate()) : endDate.getDate());
			
			loadData.from = initDate.getFullYear() + '-' + from_month_initDate + '-' + from_day_initDate + 'T' + '23:59:59';
			loadData.to = endDate.getFullYear() + '-' + from_day_initDate + '-' + to_day_endDate + 'T' + '23:59:59';
		}
		else {
			utils.unlockScreen();
			utils.modal("No puede realiza la búsqueda", "Necesita seleccionar la fecha de inicio y la fecha de fin para realizar la búsqueda.");
			return;
		}
	}
	
	return loadData;
}