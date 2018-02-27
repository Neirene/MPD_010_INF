
$('<a>',{text: localizer.get('init'), href:utils.getMainUrl()}).appendTo('.breadcrumbs');

var data;



window.addEventListener('WebComponentsReady',function() {
	
	if(utils.getURLParam('outdoor')){
		$('<a>',{text: localizer.get('outdoor_analytics'),href: '/outdoor_analytics'}).appendTo('.breadcrumbs');
		utils.get('/api/clusters/'+id_cluster+'/outdoor', {}, (response) => {
			if(response.totalImpacts > 0) 
				$('quantitative-analytical[name="totalImpacts"]')[0].setContent(response.totalImpacts.toLocaleString());
			
			
			/*if(response.totalUsersImpacted > 0) 
				$('quantitative-analytical[name="totalUsersImpacted"]')[0].setContent(response.totalUsersImpacted.toLocaleString());
			else 
				$('quantitative-analytical[name="totalUsersImpacted"]').remove();
			*/
			if(response.avarageFrequency > 0) 
				$('quantitative-analytical[name="avarageFrequency"]')[0].setContent(response.avarageFrequency.toLocaleString());
			
			
			if(!response.totalImpacts && !response.avarageFrequency) 
				$('.quantitative-container').hide();
		})
		
		
		
	}
	else {
		$('.quantitative-container').hide();
		$('<a>',{text: localizer.get('Clusters'),href: '/clusters'}).appendTo('.breadcrumbs');	
	}
	
	$('.demographic-filter').remove();
	
	let accountData = JSON.parse(localStorage.accountData);
	if(accountData.userHeader.roleEntity.role.role != "ROLE_ADMIN_EDIT") {
  		$('#clusterStatsEdition').hide();
  	}
	
	common.initSlider('slider');

	$('#clusterActions').attr('elem-id',id_cluster);
	$('#clusterOutdoorActions').attr('elem-id',id_cluster);
	if(utils.getURLParam('outdoor')) {
		$('#clusterActions').remove();
	}
	else{
		$('#clusterOutdoorActions').remove();
	}
	
	let PieChart = customElements.get('pie-chart');
	
	if(id_cluster) {

		//Pie charts statistics
		utils.apiGet('/cluster/'+id_cluster, {}, function(response) {
			
			data = response;
			
			$('h3#title').html(response[0].name);
			let total = Number(response.total);
			if(!isNaN(total)) {
				$('.demographic-total').html(total.toLocaleString())
				
				if($('quantitative-analytical[name="totalUsersImpacted"]').length > 0)
				$('quantitative-analytical[name="totalUsersImpacted"]')[0].setContent(total.toLocaleString());
			}
			if(!response.name) {
				utils.get('/api/clusters/'+id_cluster, {}, function(resp) {
					$('h3#title').html(resp.name);
				})
			}
			
			var properties = data.properties;
			$.map(properties, (prop) => {
				$.map(prop.values, (val) => {
					$('input[name="' + val.toString().replace(/"/g, '') + '"]').val(val.quantity);
				});
			});
			drawPies(response, "main-pies-container", utils.getPieColors());
			
			drawTopSummary(response.properties);

		})
		
		
		//$('#psychographic-categories_app').remove();
//		$('#psychographic-apps').remove();
		//Apps
		/*
		 * 
		 utils.apiGet(/cluster/+id_cluster+"/_apps", {}, function(response) {
			Object.keys(response).forEach(function(key) {
				if(key == 'WhatsApp Messenger' || key == 'Facebook' || key == 'Messenger'
				|| key == 'Instagram' || key == 'Samsung Push Service' || key == 'Snapchat'
				|| key == 'Youtube')
					delete response[key];				
			});
			
			var total = calculateTotal(response);
			
			// Set '%' to categories.
			Object.keys(response).forEach(function(key) {
				var quantity = response[key];				
				var percent = ((quantity*100)/total);
				
				response[key] = Math.round(percent*100)/100;
			});
			
			// Load TOP 7.
			var top = getTop(response);
			
			drawTable('apps',top);
			
			
			
			$('#psychographic-apps').append('<span style="font-style: italic;">Excluidas las Apps más frecuentes</span>');
		})
		*/
		
		/*GET CATEGORIES*/
		utils.get("/api/clusters/"+id_cluster+"/psychographic/categories", {}, function(response) {
			utils.drawBulletGraph('categories',response.weights) 

			if(response && response.max) $('#summary-data').prop("categories_app",response.max.replace('&amp;', '&'));	

			//$('#psychographic-categories_app').append('<span style="font-style: italic;">Excluidas las categorías más frecuentes</span>');
		})
		
		/*GET IAB*/
		utils.get("/api/clusters/"+id_cluster+"/psychographic/iab", {}, function(response) {
			utils.drawBulletGraph('iab',response.weights) 
			if(response && response.max) $('#summary-data').prop("iab",response.max.replace('&amp;', '&'));	


		})
		
		/*GET APPS*/
		utils.get("/api/clusters/"+id_cluster+"/psychographic/apps", {}, function(response) {
			utils.drawBulletGraph('apps',response.weights) 
			if(response && response.max) $('#summary-data').prop("apps",response.max.replace('&amp;', '&'));	


		})
		
		/*GET KEYWORDS*/
		utils.get("/api/clusters/"+id_cluster+"/psychographic/keywords", {}, function(response) {
			utils.drawBulletGraph('keywords',response.weights) 
			if(response && response.max) $('#summary-data').prop("interests",response.max.replace('&amp;', '&'));	
		})
		
		
		//Apps
		utils.apiGet(/cluster/+id_cluster+"/_iab", {}, function(response) {
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
		utils.apiGet(/cluster/+id_cluster+"/_interests", {}, function(response) {
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
	}
	
	utils.apiGet("/cluster/"+id_cluster+"/_lookalike",{}, function(response) {
		lookalikeData = response;
		selectOptions = [];
		response.forEach((elem) => {
			let split = elem.cluster_id.split('-');
			selectOptions.push({id:elem.cluster_id, value:split[split.length - 1]+" ("+elem.total.toLocaleString()+")"})
		})
		
		$('#lookalike-selector')[0].setOptions(selectOptions);
	})

	$('#lookalike-selector').on('change', function(e) {
		lookalikeData.some((elem) => {
			if(elem.cluster_id == e.detail) {
				drawPies(elem, "lookalike-compare-pies-container", "blue");
				$('#lookalike-compare-pies-container').removeClass('hidden');
				return true;
			}
		})
		
	})
	
	$('infinia-tabs').on('tabSelected', function(e) {
		if(e.detail == 2){
			
			
			$('profile-map').each((index, elem) => {
				elem.mapId = id_cluster;
				elem.mapType = "cluster";
				elem.init();
			})
			
			
			/*let queryPr = CartoUtils.getClusterHomePlaceProvinces(id_cluster);
			let queryMun = CartoUtils.getClusterHomePlaceMunicipalities(id_cluster);
			let queryDis = CartoUtils.getClusterHomePlaceDistricts(id_cluster);
			homeplace.setCartoLayer('base', queryPr, CartoUtils.getStyle('polygonStyle'));
			updateData('home-data', queryPr);
			
			$(homeplace).on('zoom_changed', function(e) {
				if(e.detail <=6) {
					homeplace.$.cartoManagement.setLayerSql('base', queryPr, CartoUtils.getStyle('polygonStyle'))
					updateData('home-data', queryPr);
				}
				
				else if(e.detail < 10) {
					homeplace.$.cartoManagement.setLayerSql('base', queryMun, CartoUtils.getStyle('polygonStyle'))
					updateData('home-data', queryMun);
				}
				
				else {
					homeplace.$.cartoManagement.setLayerSql('base', queryDis, CartoUtils.getStyle('polygonStyle'))
					//updateData('home-data', CartoUtils.getClusterHomePlaceDistricts(id_cluster));
				}
			})
			
			
			let workplace = $('base-map[id="work-map"]')[0]; 
			workplace.init();
			workplace.setCartoLayer('base', CartoUtils.getClusterWorkPlaceProvinces(id_cluster), CartoUtils.getStyle('polygonStyle'));
			updateData('work-data', CartoUtils.getClusterWorkPlaceProvinces(id_cluster));
			$(workplace).on('zoom_changed', function(e) {
				if(e.detail <=6) {
					workplace.$.cartoManagement.setLayerSql('base', CartoUtils.getClusterWorkPlaceProvinces(id_cluster));
					updateData('work-data', CartoUtils.getClusterWorkPlaceProvinces(id_cluster));
				}
				
				else if(e.detail < 9) {
					workplace.$.cartoManagement.setLayerSql('base', CartoUtils.getClusterWorkPlaceMunicipalities(id_cluster))
					updateData('work-data', CartoUtils.getClusterWorkPlaceMunicipalities(id_cluster));
				}	
				
				else{
					workplace.$.cartoManagement.setLayerSql('base', CartoUtils.getClusterWorkPlaceDistricts(id_cluster))
				}
			})
			
			let vitalzoneplace = $('base-map[id="vitalZone-map"]')[0]; 
			vitalzoneplace.init();
			vitalzoneplace.setCartoLayer('base', CartoUtils.getClusterVitalzonePlaceProvinces(id_cluster), CartoUtils.getStyle('polygonStyle'));
			updateData('vitalzone-data', CartoUtils.getClusterVitalzonePlaceProvinces(id_cluster));
			$(vitalzoneplace).on('zoom_changed', function(e) {
				if(e.detail <=6) {
					vitalzoneplace.$.cartoManagement.setLayerSql('base', CartoUtils.getClusterVitalzonePlaceProvinces(id_cluster))
					updateData('vitalzone-data', CartoUtils.getClusterVitalzonePlaceProvinces(id_cluster));
				}
				else if(e.detail < 9) {
					vitalzoneplace.$.cartoManagement.setLayerSql('base', CartoUtils.getClusterVitalzonePlaceMunicipalities(id_cluster))
					updateData('vitalzone-data', CartoUtils.getClusterVitalzonePlaceMunicipalities(id_cluster));
				}
				else
					vitalzoneplace.$.cartoManagement.setLayerSql('base', CartoUtils.getClusterVitalzonePlaceDistricts(id_cluster))
			})*/
		}
		else if(e.detail == 3){
			drawPies(data, "lookalike-pies-container", utils.getPieColors());
		}
	}) 
		
	$('#save-statistics').on('click', function() {
		
		var total = 0;
		$('input.stats').each((index, input) => { 
			total += Number($(input).val());
		});
		
		utils.lockScreen();
		var stats = {
			clusterId : id_cluster,
			executionDate : data.execution_date | 0,
			total : total,
			lastExecution : data.last_execution | new Date()
		};
		
		if (data.properties){
			var properties = JSON.parse(JSON.stringify(data.properties));
			for(var i=0; i<properties.length; i++){
				for(var j=0; j<properties[i].values.length; j++){
					if ($('input[name="' + properties[i].values[j].value + '"]').length ){
						properties[i].values[j].quantity = Number($('input[name="' + properties[i].values[j].value + '"]').val());
					}
				}
			}
			stats.properties = JSON.stringify(properties);
		}
		else {
			var properties = [
			    {
			        "values" : [ 
			            {
			                "quantity" : Number($('input[name="male"]').val()),
			                "value" : "male"
			            }, 
			            {
			                "quantity" : Number($('input[name="female"]').val()),
			                "value" : "female"
			            }
			        ],
			        "name" : "gender"
			    },
			    {
			        "values" : [ 
			            {
			                "quantity" : Number($('input[name="<12"]').val()),
			                "value" : "<12"
			            }, 
			            {
			                "quantity" : Number($('input[name="12-17"]').val()),
			                "value" : "12-17"
			            }, 
			            {
			                "quantity" : Number($('input[name="18-25"]').val()),
			                "value" : "18-25"
			            }, 
			            {
			                "quantity" : Number($('input[name="26-40"]').val()),
			                "value" : "26-40"
			            }, 
			            {
			                "quantity" : Number($('input[name="41-55"]').val()),
			                "value" : "41-55"
			            }, 
			            {
			                "quantity" : Number($('input[name=">55"]').val()),
			                "value" : ">55"
			            }
			        ],
			        "name" : "age"
			    },
			    {
			        "values" : [ 
			            {
			                "quantity" : Number($('input[name="income_E"]').val()),
			                "value" : "income_E"
			            }, 
			            {
			                "quantity" : Number($('input[name="income_D"]').val()),
			                "value" : "income_D"
			            }, 
			            {
			                "quantity" : Number($('input[name="income_C"]').val()),
			                "value" : "income_C"
			            }, 
			            {
			                "quantity" : Number($('input[name="income_B"]').val()),
			                "value" : "income_B"
			            }, 
			            {
			                "quantity" : Number($('input[name="income_A"]').val()),
			                "value" : "income_A"
			            }
			        ],
			        "name" : "income_level"
			    }
			];
			stats.properties = JSON.stringify(properties);
		}
		
		utils.post('/api/clusters/' + id_cluster + '/statistics', JSON.stringify(stats) , (response) => {
			utils.unlockScreen();
			window.location.href = "/clusters/profile/" + id_cluster;
		});
	});
	
	$('.validate-cluster').on('click', function() {
    	utils.validateCluster(id_cluster);

	})
	
	utils.checkValidateCluster();
	
})


function drawPies(response, container, color) {
	utils.drawPies(response.properties, container, color);
}




function drawTable(div, response) {
	let InfiniaTable = customElements.get('infinia-table');
	let infiniaTable = new InfiniaTable();
	
	infiniaTable.disableHeadFixed = true;
	$('#psychographic-'+div).html(infiniaTable);
	infiniaTable.hidePagination();
	infiniaTable.disableSorting();
	infiniaTable.tableColumns = [{id:0, value:localizer.get(div)}, {id:1, value:localizer.get("percent")}];
	let rows = [];
	Object.keys(response).forEach((key) => {
		rows.push(
			{id:key,
			cells:[
				{id:0, value:key}, {id:1, value:response[key]}
			]}
		);
	})
	infiniaTable.tableRows = rows;
	infiniaTable.disableDownload();
	
	
	if(rows.length > 0) {
		$('#summary-data').prop(div,rows[0].cells[0].value.replace('&amp;', '&'));	
	}
		
		
	

}

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



function calculateTotal(response) {
	var total = 0;
	
	Object.keys(response).forEach(function(key) {
		total += response[key];
	})
	
	return total;
}

function getTop(response) {
	var i = 1;
	var top = {};
	
	Object.keys(response).forEach(function(key) {
		if(i <= 7) {
			top[key] = response[key];
			i++;
		}
		else
			return top;
	});
	
	return top;
}
