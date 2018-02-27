
var extrasShown = false;
var openFormat = false;

window.addEventListener('WebComponentsReady',function() {
	
	var campaign;
	
	if(!id_campaign) {
		$('infinia-tabs').remove();
		$('.hide-create').remove();
	}else{
		
	}
	
	$('h3#title').html(localizer.get('campaign'));
	$('<a>',{text: localizer.get('init'), href:'/'+utils.getMainUrl()}).appendTo('.breadcrumbs');
	$('<a>',{text: localizer.get('campaigns'),href: '/campaigns'}).appendTo('.breadcrumbs');
	
	document.querySelector('infinia-select[name="billTo"]').setOptions([
		{id:"reseller", value:"RESELLER"}, 
		{id:"agency", value:"AGENCY"}, 
		{id:"advertiser", value:"ADVERTISER"}
	]);
	
	document.querySelector('infinia-select[name="timeZone"]').setOptions([
		{id:"Europe/Paris", value:"(GMT +1:00) Brussels, Copenhagen, Madrid, Paris"},
		{id:"America/Los_Angeles", value:"(GMT -8:00) Pacific Time (US & Canada)"},
		{id:"America/Denver", value:"(GMT -7:00) Mountain Time (US & Canada)"},
		{id:"America/Chicago", value:"(GMT -6:00) Central Time (US & Canada), Mexico City"},
		{id:"America/New_York", value:"(GMT -5:00) Eastern Time (US & Canada), Bogota, Lima"},
		{id:"America/Sao_Paulo", value:"(GMT -3:00) Brazil, Buenos Aires, Georgetown"},
		{id:"Etc/GMT", value:"(GMT) Greenwich Mean Time (no daylight savings)"},
		{id:"Europe/London", value:"(GMT) London, Lisbon, Casablanca"}
	]);

	
	
	$('infinia-select[name="timeZone"]').on('onRender', () => {
		document.querySelector('infinia-select[name="timeZone"]').setValue('selCJ7_chzn_o_14');
	});
	

	$('infinia-select[name="goalType"]').on('change', (e) => {
		var type = e.currentTarget.value;
		if (type === 'cpa' || type === 'cpc' || type === 'cpe' || type === 'reach' || type === 'roi'){
			(document.querySelector('input[name="goalValue"]').classList).add('required');
		}
		else {
			(document.querySelector('input[name="goalValue"]').classList).remove('required');
		}
		if (type === 'cpa' || type === 'cpe' || type === 'roi'){
			(document.querySelector('input[name="postClick"]').classList).add('required');
			(document.querySelector('input[name="postImpression"]').classList).add('required');
		}
		else {
			(document.querySelector('input[name="postClick"]').classList).remove('required');
			(document.querySelector('input[name="postImpression"]').classList).remove('required');
		}
	});
	
	var timing = [{id:"hour", value:"Hora"}, {id:"day", value:"Día"}, {id:"week", value:"Semana"}, {id:"month", value:"Mes"}];
	$('.unit-time').each(function(index, elem) {
		elem.options = timing;
	});
	
	var timingDaily = [ {id:"day", value:"Día"}, {id:"hour", value:"Hora"}];
	$('.unit-daily').each(function(index, elem) {
		elem.options = timingDaily;
	});
	
	$('infinia-select[name="idReseller"]').on('change', function(e){
		var type = e.currentTarget.value;
		if(type!=""){
				utils.post("/api/components/selects", JSON.stringify({
					"fields":[
						{
							"id" : type,
							"field" : "agencies"
						},
						{
							"id" : type,
							"field" : "offices"
						}
					]
				}), function(advertisers) {
					document.querySelector('infinia-select[name="idAgency"]').setOptions(advertisers[0].options);
					document.querySelector('infinia-select[name="idOffice"]').setOptions(advertisers[1].options);

					if (campaign && campaign.idAgency){
						$('infinia-select[name="idAgency"]').on('onRender', function(e) {
								document.querySelector('infinia-select[name="idAgency"]').setValue(campaign.idAgency);
						});
					}else{
						document.querySelector('infinia-select[name="idAgency"]').setValue("");

					}
					
					
					if (campaign && campaign.idOffice){
						$('infinia-select[name="idOffice"]').on('onRender', function(e) {
								document.querySelector('infinia-select[name="idOffice"]').setValue(campaign.idOffice);
								});
					}else{
						document.querySelector('infinia-select[name="idOffice"]').setValue("");

					}
					
				});	
				
				utils.get('/api/agencies/'+type, {}, function(response) {
					var reseller = response;
					openFormat = reseller.openFormat;
					loadGoalType();
				
				});
				
		}else{
			document.querySelector('infinia-select[name="idAgency"]').setOptions([]);

		}
		});
	
	$('infinia-select[name="idAgency"]').on('change', function(e){
		var type = e.currentTarget.value;
		if(type!=""){
			utils.post("/api/components/selects", JSON.stringify({
				"fields":[
					{
						"id" : type,
						"field" : "advertisers"
					}
				]
			}), function(advertisers) {
				document.querySelector('infinia-select[name="idAdvertiser"]').setOptions(advertisers[0].options);

				if (campaign && campaign.idAdvertiser){
					$('infinia-select[name="idAdvertiser"]').on('onRender', function(e) {
							document.querySelector('infinia-select[name="idAdvertiser"]').setValue(campaign.idAdvertiser);
					});
				}else{
					document.querySelector('infinia-select[name="idAdvertiser"]').setValue("");

				}
			
				
				
			});
			}else{
				document.querySelector('infinia-select[name="idAdvertiser"]').setOptions([]);
				document.querySelector('infinia-select[name="idOffice"]').setOptions([]);
				document.querySelector('infinia-select[name="idTrafficker"]').setOptions([]);
			}
	});
	
	document.querySelector('infinia-select[name="budgetCappingType"]').setOptions([
		{id:'even', value:'EVEN'},
		{id:'asap', value:"ASAP"},
		{id:'no-limit', value:"No Cap"}
	]);
	document.querySelector('infinia-select[name="impressionsCappingType"]').setOptions([
		{id:'even', value:'EVEN'},
		{id:'asap', value:"ASAP"},
		{id:'no-limit', value:"No Cap"}
	]);
	document.querySelector('infinia-select[name="frequencyType"]').setOptions([
		{id:"asap", value:"ASAP"}, 
		{id:"even", value:"EVEN"}, 
		{id:"no-limit", value:"No Cap"}
	]);
	$('infinia-select[name="budgetCappingType"]').on('change', function(e){
		var type = $(this).val();
		
		if (type === 'even' || type === 'asap'){
			$('#budgetCappingContainer').show();
			(document.querySelector('input[name="budgetCappingAmount"]').classList).add('required');
			(document.querySelector('input[name="budgetCappingTimeAmount"]').classList).add('required');
			(document.querySelector('infinia-select[name="budgetCappingTimeInterval"]').classList).add('required');
		}
		else {
			$('#budgetCappingContainer').hide();
			(document.querySelector('input[name="budgetCappingAmount"]').classList).remove('required');
			(document.querySelector('input[name="budgetCappingTimeAmount"]').classList).remove('required');
			(document.querySelector('infinia-select[name="budgetCappingTimeInterval"]').classList).remove('required');
		}
	});
	
	$('infinia-select[name="impressionsCappingType"]').on('change', function(e){
		var type = $(this).val();
		
		if (type === 'even' || type === 'asap'){
			$('#impressionsCappingContainer').show();
			(document.querySelector('input[name="impressionsCappingAmount"]').classList).add('required');
			(document.querySelector('input[name="impressionsCappingTimeAmount"]').classList).add('required');
			(document.querySelector('infinia-select[name="impressionsCappingTimeInterval"]').classList).add('required');
		}
		else {
			$('#impressionsCappingContainer').hide();
			(document.querySelector('input[name="impressionsCappingAmount"]').classList).remove('required');
			(document.querySelector('input[name="impressionsCappingTimeAmount"]').classList).remove('required');
			(document.querySelector('infinia-select[name="impressionsCappingTimeInterval"]').classList).remove('required');
		}
	});
	
	$('infinia-select[name="frequencyType"]').on('change', function(e){
		var type = $(this).val();
		
		if (type === 'even' || type === 'asap'){
			$('#frequencyContainer').show();
			(document.querySelector('input[name="frequencyAmount"]').classList).add('required');
			(document.querySelector('infinia-select[name="frequencyInterval"]').classList).add('required');
		}
		else {
			$('#frequencyContainer').hide();
			(document.querySelector('input[name="frequencyAmount"]').classList).remove('required');
			(document.querySelector('infinia-select[name="frequencyInterval"]').classList).remove('required');	
		}
	});
	$('infinia-select[name="frequencyType"]').on('onRender', () => {
		if(id_campaign==null)
			document.querySelector('infinia-select[name="frequencyType"]').setValue("no-limit");
	});
	$('infinia-select[name="impressionsCappingType"]').on('onRender', () => {
		if(id_campaign==null)
			document.querySelector('infinia-select[name="impressionsCappingType"]').setValue("no-limit");
	});
	$('infinia-select[name="budgetCappingType"]').on('onRender', () => {
		if(id_campaign==null)
			document.querySelector('infinia-select[name="budgetCappingType"]').setValue("no-limit");
	});
	
	$('infinia-select[name="idOffice"]').on('change', function(e){
		var type = $(this).val();
		if(type!=""){
			utils.post("/api/components/selects", JSON.stringify({
				"fields":[
					{
						"id": type,
						"field":"traffickers"
					}
				]
			}), function(traffickers) {
				document.querySelector('infinia-select[name="idTrafficker"]').setOptions(traffickers[0].options);
			
				if (campaign && campaign.idTrafficker){
					$('infinia-select[name="idTrafficker"]').on('onRender', function(e) {
						document.querySelector('infinia-select[name="idTrafficker"]').setValue(campaign.idTrafficker);
						});
				}else{
					document.querySelector('infinia-select[name="idTrafficker"]').setValue("");

				}
			});
		}else{
			document.querySelector('infinia-select[name="idTrafficker"]').setOptions([]);
		}
	});
	
	new Promise((resolve, reject) => {
		utils.post("/api/components/selects", JSON.stringify({
			"fields":[
				{
					"id":"0",	
					"field":"resellers"
				},
				{
					"id":"0",
					"field":"payment_type"
				}
			]
		}), function(data) {
			document.querySelector('infinia-select[name="idReseller"]').setOptions(data[0].options);
		
			if(data[0].options.length){
				$("infinia-select[name='idReseller']").addClass("required");
			}else{
				$("infinia-select[name='idReseller']").removeClass("required");
			}
			
			document.querySelector('infinia-select[name="idPaymentType"]').setOptions(data[1].options);
			
			
			if(id_campaign)
				$("#idPaymentType")[0].disable()

			loadGoalType();

			
			resolve();
		});
	}).then(values => {
		if(id_campaign) {
			utils.lockScreen();
			utils.get('/api/campaigns/'+id_campaign, {}, function(response) {
				campaign = response;
				$('#title').html(response.name);

				$('infinia-tabs')[0].addTab(0,response.name);				
				
				utils.addCampaignPaymentTabs(response, $('infinia-tabs')[0]);
				
				utils.loadFormData(response);
				$(response).each(function(index, elem) {
					var i=0;
					if(response.markups) {
						$('.markup').each(function(index, elem) {
							$(elem).val(response.markups[i]);
							i++;
						});
					}
					
					if(response.kpis) {
						$('.kpi').each(function(index, elem) {
							$(elem).val(response.kpis[i]);
							i++;
						});
					}
					
					$('textarea[name="thirdPartyPixel"]').html(response.thirdPartyPixel);
				})
				
				if(response.mediamathId && response.mediamathId > 0) {
					$('date-picker[name="startDate"]')[0].disable();
					
					document.querySelector('date-picker[name="endDate"]').setMinDate(new Date(document.querySelector('date-picker[name="startDate"]').getValue()));
					
					$('infinia-select[name=idReseller]')[0].disable();
					$('infinia-select[name=idAgency]')[0].disable();
					$('infinia-select[name=idAdvertiser]')[0].disable();
					$('infinia-select[name=goalType]')[0].disable();
				}
				
				var $fileLoader = $('file-loader[name="buyOrder"]');
				$fileLoader[0].setFiles(response.buyOrderFile);
				
				utils.unlockScreen();
			});
		}
		else {
			// Set max/min date for the date picker
			var minDate = new Date();
			minDate.setDate(minDate.getDate());
			document.querySelector('date-picker[name="startDate"]').setMinDate(minDate);
			document.querySelector('date-picker[name="endDate"]').setMinDate(minDate);
		}
		$('date-picker[name="startDate"]').on('dateSelected', (d) => {
			var dat = new Date(document.querySelector('date-picker[name="startDate"]').getValue());
			document.querySelector('date-picker[name="endDate"]').setMinDate(dat);
		});	
		$('date-picker[name="endDate"]').on('dateSelected', (d) => {
			var dat = new Date(document.querySelector('date-picker[name="endDate"]').getValue());
			document.querySelector('date-picker[name="startDate"]').setMaxDate(dat);
		});
	});

});


	$('.save-campaign').on('click', function() {
		 
		if($('input[name="name"]').val().includes(',')) {
			utils.floatingError("El nombre no puede contener comas");
			$('input[name="name"]').addClass('has-error');
			return false;
		}
		
		if(utils.validateRequired('campaign-form')){
			var formData = utils.getFormAsObject('campaign-form');
			var markups = [];
			$('.markup').each(function(index, elem){
				if($(elem).val())
					markups.push($(elem).val());
			});
			formData.markups = markups;
			
			var kpis = [];
			$('.kpi').each(function(index, elem){
				if($(elem).val())
					kpis.push($(elem).val());
			});
			
			formData.kpis = kpis;
			
			if(id_campaign) {
				formData.id = id_campaign
			}
			if (formData.idOrderLines){
				formData.idOrderLines = formData.idOrderLines.split(',');
			}else{
				formData.idOrderLines = [];
			}
			
	
			
			if (!extrasShown && !id_campaign && $('infinia-select[name="idPaymentType"]').val() == "") {
				$('infinia-popup')[0].startPopup();
				extrasShown = true;
				return;
			}
	
	
					
			
			
			utils.lockScreen();
			$('file-loader[name="buyOrder"]')[0].uploadFiles('campaign').then(value => {
				formData.buyOrderFile = JSON.stringify(value);
				
				utils.post('/api/campaigns', JSON.stringify(formData), function(response) {
					utils.unlockScreen();
					if(response.resultCode == 0) {
						utils.floatingSuccess('Guardado');
						setTimeout(() => {
							if(!id_campaign){
								location.reload();
								window.location = '/campaigns/'+response.id;
							}
						}, 1000)
						
						/*utils.modal("Campaña creada", "La campaña se ha creado correctamente <br><br>"+
								"<a href='/order_lines/new?id_campaign="+response.id+"'>Añadir una línea de pedido a la campaña</a><br><br>"+
								"<a href='/campaigns/" + response.id + "'>Editar campaña</a><br><br>"+
								"<a href='/campaigns/" + id_campaign + "/order_lines'>Volver a listado de líneas</a><br><br>"+
								"<a href='/campaigns'>Volver a campañas</a><br><br>", {disableCloseButton:true});*/
					}				
				});
			});
			
			
		}
	});
  	
});

function selectAdditionalService(serviceValue) {
	
	if(serviceValue == 1) {
		$('infinia-select[name="idPaymentType"]').val('1')
	}else if (serviceValue == 2){
		$('infinia-select[name="idPaymentType"]').val('2')
	
	}else if (serviceValue == 3){
		$('infinia-select[name="idPaymentType"]').val('3')
	
	}else if (serviceValue == 4){
		$('infinia-select[name="idPaymentType"]').val('4')
	
	}else if (serviceValue == 5){
		$('infinia-select[name="idPaymentType"]').val('5')
	}
	
}

function loadGoalType(){
let accountData = JSON.parse(localStorage.accountData);
	
  	if(accountData.userHeader.roleEntity.role.role == "ROLE_RESELLER") {

  		if(!openFormat){
  			document.querySelector('infinia-select[name="goalType"]').setOptions([
  	  			{id:"spend", value:"CPM Premium"},
  	  			{id:"cpm", value:"CPM Spend"}
  	  			
  	  	]);

  	  		$('#costsContainer').hide();
  			$('#markupsContainer').hide();
  			$('#attWindow').hide();
  			//$('#budgetContainer').hide();
  			$('#impressionsContainer').hide();
  			$('#goalValueContainer').hide();
  			
  			(document.querySelector('input[name="budget"]').classList).add('required');
  			(document.querySelector('input[name="impressions"]').classList).remove('required');
  			
  			
  		}else{
  			document.querySelector('infinia-select[name="goalType"]').setOptions([
  	  			{id:"openFormat", value:"CPM Spend"}
  	
  			
  	  	]);
  			
  			
  	  		$('#costsContainer').hide();
  			$('#markupsContainer').hide();
  			$('#attWindow').hide();
  			$('#budgetContainer').hide();
  			//$('#impressionsContainer').hide();
  			$('#goalValueContainer').hide();
  			$('#capsContainer').hide();

  			(document.querySelector('input[name="budget"]').classList).remove('required');
  			(document.querySelector('input[name="impressions"]').classList).remove('required');
  		}

  	}
  	else {
  		
  		if(!openFormat){
  			document.querySelector('infinia-select[name="goalType"]').setOptions([
  	  			{id:"spend", value:"CPM Premium"},
  	  			{id:"cpm", value:"CPM Spend"},
  	  			{id:"roi", value:"ROI"}, 
  	  			{id:"cpa", value:"CPA"}, 
  	  			{id:"cpc", value:"CPC"}, 
  	  			{id:"ctr", value:"CTR"}, 
  	  			{id:"vcr", value:"Video Completion Rate"},
  	  			{id:"viewability_rate", value:"Viewability Rate"},
  	  			{id:"vcpm", value:"Viewable CPM"},
  	  			{id:"reach", value:"CPM REACH"}

  	  		]);
  		}else{
  			document.querySelector('infinia-select[name="goalType"]').setOptions([
  	  			
  	  			{id:"openFormat", value:"CPM Spend"}

  	  		]);
  			
  			$('#costsContainer').hide();
  			$('#markupsContainer').hide();
  			$('#attWindow').hide();
  			$('#budgetContainer').hide();
  			//$('#impressionsContainer').hide();
  			$('#goalValueContainer').hide();
  			$('#capsContainer').hide();

  			(document.querySelector('input[name="budget"]').classList).remove('required');
  			(document.querySelector('input[name="impressions"]').classList).remove('required');
  		}
  			
  	
  		
  	}

}
>>>>>>> develop
