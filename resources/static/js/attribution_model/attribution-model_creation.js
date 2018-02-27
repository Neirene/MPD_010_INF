
window.addEventListener('WebComponentsReady',function() {
	if(id_campaign){
		$('#cluster-selector-container').remove();
		$('<a>',{text: localizer.get('init'), href:'/'+utils.getMainUrl()}).appendTo('.breadcrumbs');
		$('<a>',{text: localizer.get('campaigns'),href: '/campaigns'}).appendTo('.breadcrumbs');
	}
	else {
		$('.campaign-view-click').remove();
		$('.date-container').remove();
		$('<a>',{text: localizer.get('init'), href:'/'+utils.getMainUrl()}).appendTo('.breadcrumbs');
		$('<a>',{text: localizer.get('customer_journey'),href: '/attribution_model'}).appendTo('.breadcrumbs');
		$('#title').html(localizer.get('customer_journey_new'));
		$('#origin')[0].doSearch();
	}
	common.initSlider('slider-campaign-profile', 'profile-breadcrumb-controller');
	
	
	$('cluster-selector').on('clusterSelected', function(e) {
		utils.apiGet('/cluster/'+e.detail, {}, function(response) {
			$('#cluster-info').html(
					'<p>Usuarios : '+Number(response[0].total).toLocaleString()+'</p>'+
					'<p>Fecha ejecución: '+utils.formatDate(new Date(response.execution_date))+'</p>')
			console.log(response)
		})
	})
	
	
	
	if(id_campaign) {
		utils.get('/api/campaigns/' + id_campaign, {}, function(campaign) {
			$('#title').html(campaign.name);
			$('<a>',{text: campaign.name,href: '/campaigns/'+campaign.id}).appendTo('.breadcrumbs');
			
			$('infinia-tabs')[0].addTab(0,campaign.name, "", "/campaigns/"+id_campaign);
			$('infinia-tabs')[0].setActive(4);

			utils.datesDepending('date-from', 'date-to');
			$('#date-from')[0].setValue(new Date(campaign.startDate));
			$('#date-to')[0].setValue(new Date(campaign.endDate));
			if(campaign.attributionModel) {
				$('infinia-tabs')[0].addTab(4,localizer.get('attribution_model'), "", "/campaigns/"+id_campaign+"/attribution_model");	
			}
		});
	}
	
	
	$('#add-ph-kpi').on('click', function() {
		$('removable-content').each((index, elem) => {
			elem.collapse();
		})
		$('#kpi-container').append(getPhysicalKPITemplate());
		setDatesDepending();
	}) 
	
	$('#add-dig-kpi').on('click', function() {
		$('removable-content').each((index, elem) => {
			elem.collapse();
		})
		$('#kpi-container').append(getDigitalKPITemplate());
		setDigitalSearch();
		setDatesDepending();
	})
	
	function setDatesDepending() {
		let kpi = $($('#kpi-container').find('.kpi').last());
		utils.datesDependingObj(kpi.find('date-picker.from'), kpi.find('date-picker.to'));
	}
	
	$('#save-model').on('click', function() {
		
		
		$('.has-error').removeClass('has-error');
		
		
		if(!$('#campaignName').val()) {
			utils.floatingError(localizer.get('campaignValidation.nameRequired'));
			$('#campaignName').addClass('has-error');
			return;
		}
		
		if($('#views').length > 0 && $('#clicks').length > 0) {
			if(!$('#views').prop('checked') && !$('#clicks').prop('checked')) {
				utils.floatingError(localizer.get('campaignValidation.modelSelectionRequired'));
				return;
			}
		}
		if(!id_campaign && $('cluster-selector')[0].getData().accepted.length == 0) {
			utils.floatingError(localizer.get("Hay que seleccionar un cluster de origen"));
			return;
		}
		
		let id = id_campaign ? id_campaign : $('cluster-selector')[0].getData().accepted[0].id;
		let originType = id_campaign ? "CAMPAIGN" : "CLUSTER";
		let type = $('#views').prop('checked') && $('#clicks').prop('checked') ? "both" : $('#views').prop('checked') ? "view" : "click";
		
		let noPhisic = true;
		let noDigital = true;
		let requiredFields = false;
		
		let dateFrom = $('#date-from').length > 0 ? $('#date-from')[0].getValue() : 0;
		let dateTo = $('#date-to').length > 0 ? $('#date-to')[0].getValue() : 0;
		
		let data = {
			id:id,
			name:$("#campaignName").val(),
			originType:originType,
			createDate:new Date().getTime(),
			configuration:{
				campaign:{
					id:id_campaign,
					from:dateFrom,
					to:dateTo,
					type:type
				}
			},
			kpiFisics:[],
			kpiDigital:[]
		};
		
		$('.kpi').each((index, elem) => {
			let kpi = {
				name:$(elem).find('input.name').val()
			}
			
			
			if($(elem).data('type') == 'physical') {
				kpi.configuration = {
					"location":[],
					"frequency":{
						"dateFrom":$(elem).find('.from')[0].getValue(),
						"dateTo":$(elem).find('.to')[0].getValue(),
						"timeFrom":"",
						"timeTo":"",
						"repeatTimes":"",
						"repeatInterval":""
					}
				}
				
				$(elem).find('infinia-map')[0].pois.forEach((poi) => {
					kpi.configuration.location.push({lat:poi.center.lat(), lng: poi.center.lng(), rad:poi.radius/1000, type:'poi'});
				})
				
				if(kpi.configuration.location.length > 0)
					noPhisic = false;
				
				if(!kpi.configuration.frequency.dateFrom || !kpi.configuration.frequency.dateTo || !kpi.name) 
					requiredFields = true;
				kpi.configuration = JSON.stringify(kpi.configuration);

				data.kpiFisics.push(kpi);	
				
			}
			else {
				kpi.configuration = {
					interests:{accepted:$(elem).find('list-accept-block')[0].getData()},
					frequency:{
						"dateFrom":$(elem).find('.from')[0].getValue(),
						"dateTo":$(elem).find('.to')[0].getValue(),
						"timeFrom":"",
						"timeTo":"",
						"repeatTimes":"",
						"repeatInterval":""
					}
				};
				
				if(kpi.configuration.interests.accepted.length > 0)
					noDigital = false;
				
				if(!kpi.configuration.frequency.dateFrom || !kpi.configuration.frequency.dateTo || !kpi.name) 
					requiredFields = true;
				
				kpi.configuration = JSON.stringify(kpi.configuration);
				data.kpiDigital.push(kpi);
			}
		})
		
		if(data.kpiDigital.length == 0 && data.kpiFisics.length == 0) {
			utils.floatingError(localizer.get('campaignValidation.kpiRequired'));
			return;
		} 
	
		if(noDigital && noPhisic) {
			utils.floatingError(localizer.get('campaignValidation.kpiRequired'));
			return;
		}
		
		if(requiredFields) {
			utils.floatingError(localizer.get('Existe algún KPI sin todos los datos'));
			return;
		}
		
		utils.lockScreen();
		data.configuration = JSON.stringify(data.configuration);
		utils.post('/api/ma/create', JSON.stringify(data), (response) => {
			utils.unlockScreen();
			utils.floatingSuccess(localizer.get('saved'));
		}, 
		(response) => {
			if(response.status == 200) {
				utils.unlockScreen();
				utils.floatingSuccess(localizer.get('saved'));
			}
			else {
				utils.unlockScreen();
				utils.floatingSuccess(localizer.get('error'));
			}
		})
	})
	
})

function getPhysicalKPITemplate() {
	return [
		'<removable-content><div class="row kpi" data-type="physical">',
		'<div class="col-sm-5">',
			'<p><span>Nombre</span><input class="form-control name" placeholder="Nombre"/></p>',
			'<div class="row">',	
				'<div class="col-sm-5"><span>Desde</span><date-picker input-class="gold" class="from"></date-picker></div><div class="col-sm-5"><span>Hasta</span><date-picker input-class="gold" class="to"></date-picker></div>',
			'</div>',
		'</div>',
		'<div class="col-sm-7 mt20"><infinia-map on-start="true" show-searcher="true" load-csv="true"></infinia-map></div></div>',
		
	'<div></removable-content>'].join("");
}

function getDigitalKPITemplate() {
	return [
		'<removable-content>',
			'<div class="row kpi" data-type="digital">',
				'<div class="col-sm-5">',
					'<p class="mt10"><label>KPI digital</label></p><p class="mt20"><span>Nombre</span><input class="form-control name" placeholder="Nombre"/></p>',
					'<div class="row">',	
					'<div class="col-sm-5"><span>Desde</span><date-picker class="from" input-class="gold"></date-picker></div><div class="col-sm-5"><span>Hasta</span><date-picker input-class="gold" class="to"></date-picker></div>',
					'</div>',
				'</div>',
			
				'<div class="col-sm-6 col-sm-offset-1 mt20">',
					'<p>Mínimo 3 caracteres para búsqueda:</p><list-accept-block class="digital-kpi" hide-block="true" hide-accept="true"></list-accept-block>',
				'</div>',
			'</div>',
			
		'</removable-content>'
		].join("");
	
}

function setDigitalSearch() {
	$('.digital-kpi').unbind();
	$('.digital-kpi').on('filterList', function(e) {
		let list = this;
		var val = e.detail;
		if (val.length >= 3){
			utils.get("/api/interests/leiki/" + val, {}, function(keywords) {
				if(keywords) {
					let l = keywords.map((keyword) => {
						return { id : keyword.id, value : keyword.name };
					})
					
					list.setList(l);
				}
			});
		}
	});
}
