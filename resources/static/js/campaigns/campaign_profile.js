
var profileData;
var psychoData;

window.addEventListener('WebComponentsReady',function() {
	
	common.initSlider('slider-campaign-profile', 'profile-breadcrumb-controller')
	
	utils.get('/api/'+endpoint+'/' + id_campaign, {}, function(campaign) {
		$('#title').html(campaign.name);
		$('<a>',{text: campaign.name,href: '/'+endpoint+'/'+campaign.id}).appendTo('.breadcrumbs');
		$('infinia-tabs')[0].addTab(0,campaign.name, "", "/"+endpoint+"/"+id_campaign);
		if(type=="infinia") {
			utils.addCampaignPaymentTabs(campaign, $('infinia-tabs')[0]);
			$('infinia-tabs')[0].setActive(3);
		}
		else {
			$('infinia-tabs')[0].setActive(1);
		}
	});
	
	
	$('#profile-selector')[0].setOptions([
		{id:'summary', value:localizer.get('summary'), icon:'icons:bookmark'},
		{id:'demographic', value:localizer.get('cluster.demographic'), icon:'icons:supervisor-account'},
		{id:'psychographic', value:localizer.get('cluster.psychographic'), icon:'hardware:phone-android'},
		{id:'behavioral', value:localizer.get('cluster.behavioral'), icon:'social:public'},
	])
	
	setTimeout(() => {$('#profile-selector')[0].setValue('summary')}, 100);
	
	let accountData = JSON.parse(localStorage.accountData);
	if(accountData.userHeader.roleEntity.role.role != "ROLE_ADMIN_EDIT") {
  		$('#campaignProfileEdition').hide();
  	}
	
	$('<a>',{text: localizer.get('init'), href:'/'+utils.getMainUrl()}).appendTo('.breadcrumbs');
	$('<a>',{text: localizer.get('campaigns'),href: '/campaigns'}).appendTo('.breadcrumbs');

	let profilePromise = new Promise((resolve, reject) => { 
		utils.get('/api/campaigns/' + id_campaign + '/profile/'+type , {}, function(response) {
			profileData = response;
			let data;
			if(response) {
				response.some(elem => {
					if(elem.event == $('#view-click-selector')[0].selected) {
						data = elem;
						return true;
					}
				})
			}
			resolve(drawData(data));
		})
	})
	
	$('#view-click-selector').on('iron-select', function() {
		if(profileData) {
			profileData.forEach(elem => {
				if(elem.event == this.selected) {
					drawData(elem);
				}
			})
		}
		if(psychoData){
			psychoData.forEach(elem => {
				if(elem.event == this.selected) {
					drawPsychographic(elem);
				}
			})
		}
		
		drawMaps();
	})
	
	
	
	$('#profile-selector').on('change', function(e){
		if(e.detail) {
			$('.section').addClass('hidden');
			$('.section.'+e.detail).removeClass('hidden');
			
			if(e.detail == 'behavioral') {
				drawMaps();				
			}
			else if(e.detail == 'demographic') {
				profilePromise.then((properties) => {
					if(properties) {
					
						utils.drawPies(properties, "main-pies-container");
					
						$.map(properties, (prop) => {
							$.map(prop.values, (val) => {
								$('input[name="' + val.value + '"]').val(val.quantity);
							});
						});
					}
				})
			}
		}
	})
	
	


	

	
	
	$('#generate_cluster').on('click', function() {
		utils.modal("Nombre del cluster", "" +
			"<p>Nombre del cluster:</p>" +
			"<div class='row'><div class='col-sm-6'>" +
			"<input class='form-control' id='cluster_name'/>" +
			"<button class='mt10 btn btn-primary' id='save-cluster'>Generar</button>" +
			"</div></div>");
		
		$('#save-cluster').on('click', function() {
			$('.closePopup').click();
			utils.modal("Nombre del cluster",
			"<p>Solicitud de cluster enviada, el proceso de generación durará varias horas </p>");
		})
	})
	
	
	utils.get('/api/campaigns/'+id_campaign+'/psychographic/'+type, {}, (response) => {
		if(response) {
			psychoData = response;
			response.some(elem => {
				if(elem.event == $('#view-click-selector')[0].selected) {
					drawPsychographic(elem);
				}
			})
		}
		
	})
	
	
})

function drawData(data) {
	if (data && data.valuesString){
		properties = JSON.parse(data.valuesString);
		utils.drawPies(properties, "main-pies-container");	
		$.map(properties, (prop) => {
			$.map(prop.values, (val) => {
				$('input[name="' + val.value + '"]').val(val.quantity);
			});
		});
		return properties;
	}
}

function drawPsychographic(response) {
	
	
    $('#summary-data')[0].categories_app = response.maxCategories;
    $('#summary-data')[0].iab = response.maxIAB;
    $('#summary-data')[0].interests = response.maxKeywords;
    $('#summary-data')[0].apps = response.maxApps;
	
	
	if(response.weightAppCategories) {
			utils.drawBulletGraph('categories',response.weightAppCategories)
	}else{
		$(".psychographic-categories").text("NO DATA");
	}
	
	
	if(response.weightApps) {
			utils.drawBulletGraph('apps',response.weightApps)
	}else{
		$(".psychographic-apps").text("NO DATA");
	}
	
	
	if(response.weightIAB) {
			utils.drawBulletGraph('iab',response.weightIAB)
	}else{
		$(".psychographic-iab").text("NO DATA");
	}
	
	
	if(response.weightKeywords) {
			utils.drawBulletGraph('keywords',response.weightKeywords)
	}else{
		$(".psychographic-keywords").text("NO DATA");
	}
	
	/*
	
	Object.keys(response).forEach((key) => {
		if(key = "weightAppCategories"){
			if(response.weightAppCategories) {
				utils.drawBulletGraph('categories',response.weightAppCategories)
			}
		}
		if(key = "weightApps"){
			if(response.weightApps) {
				utils.drawBulletGraph('apps',response.weightApps)
			}
		}
		if(key = "weightIAB"){
			if(response.weightIAB) {
				utils.drawBulletGraph('iab',response.weightIAB)
			}
		}
		if(key = "weightKeywords"){
			if(response.weightKeywords) {
				utils.drawBulletGraph('keywords',response.weightKeywords)
			}
		}
	})
	
	*/
	
}

function drawMaps() {
	$('profile-map').each((index, elem) => {
		elem.mapId = id_campaign;
		elem.mapType = "campaign";
		elem.mapSection = elem.mapSection + cartoTable;
		elem.whereQuery = " WHERE event='"+$('#view-click-selector')[0].selected+"'";
		elem.init();
	})
}