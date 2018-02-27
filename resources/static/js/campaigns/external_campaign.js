
var extrasShown = false;
window.addEventListener('WebComponentsReady',function() {
	
	var campaign;
	
	if(!id_campaign) {
		$('infinia-tabs').remove();
		$('.hide-create').remove();
	}else{
		
	}
	
	$('h3#title').html(localizer.get('external_campaign'));
	$('<a>',{text: localizer.get('init'), href:'/'+utils.getMainUrl()}).appendTo('.breadcrumbs');
	$('<a>',{text: localizer.get('external_campaigns'),href: '/external_campaigns'}).appendTo('.breadcrumbs');
	

	
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
						$('infinia-select[name="idAgency"]').on('onRender', function(e) {
								document.querySelector('infinia-select[name="idAdvertiser"]').setValue(campaign.idAgency);
						});
					}else{
						document.querySelector('infinia-select[name="idAdvertiser"]').setValue("");

					}
					
				});	
		}else{
			document.querySelector('infinia-select[name="idAgency"]').setOptions([]);

		}
		});


	new Promise((resolve, reject) => {
		utils.post("/api/components/selects", JSON.stringify({
			"fields":[
				{
					"id":"0",
					"field":"agencies"
				},
				{
					"id":"0",
					"field":"dsp_type"
				}
			]
		}), function(data) {
			document.querySelector('infinia-select[name="idAgency"]').setOptions(data[0].options);
		
			if(data[0].options.length){
				$("infinia-select[name='idAgency']").addClass("required");
			}else{
				$("infinia-select[name='idAgency']").removeClass("required");
			}
			
			document.querySelector('infinia-select[name="idDspType"]').setOptions(data[1].options);
			
			
			resolve();
		});
	}).then(values => {
		if(id_campaign) {
			utils.lockScreen();
			utils.get('/api/external_campaigns/'+id_campaign, {}, function(response) {
				campaign = response;
				$('#title').html(response.name);
				$('infinia-tabs')[0].addTab(0,response.name);				
			
				
				utils.loadFormData(response);
//			
//				if(response.mediamathId && response.mediamathId > 0) {
//					$('date-picker[name="startDate"]')[0].disable();
//					
//					document.querySelector('date-picker[name="endDate"]').setMinDate(new Date(document.querySelector('date-picker[name="startDate"]').getValue()));
//					
//					$('infinia-select[name=idAgency]')[0].disable();
//					$('infinia-select[name=idAdvertiser]')[0].disable();
//				}
//				
//				
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
	
	let accountData = JSON.parse(localStorage.accountData);
	
  	
});

$('.save-campaign').on('click', function() {
	 
	if($('input[name="name"]').val().includes(',')) {
		utils.floatingError("El nombre no puede contener comas");
		$('input[name="name"]').addClass('has-error');
		return false;
	}
	
	if(utils.validateRequired('campaign-form')){
		var formData = utils.getFormAsObject('campaign-form');
		
		
		if(id_campaign) {
			formData.id = id_campaign
		}
		
		utils.lockScreen();
			
			utils.post('/api/external_campaigns', JSON.stringify(formData), function(response) {
				utils.unlockScreen();
				if(response.resultCode == 0) {
					utils.floatingSuccess('Guardado');
					setTimeout(() => {
						if(!id_campaign){
							location.reload();
							window.location = '/external_campaigns/'+response.id;
						}
					}, 1000)
					
				}				
			});
		
		
	}
});

