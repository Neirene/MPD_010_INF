window.addEventListener('WebComponentsReady',function() {
	var pushwoosh_campaign;
	
  
	$('<a>',{text: localizer.get('init'), href:'/'+utils.getMainUrl()}).appendTo('.breadcrumbs');
	$('<a>',{text: localizer.get('pushwoosh_campaigns'),href: '/pushwoosh_campaigns'}).appendTo('.breadcrumbs');
   
    function localize(text) {
    		return localizer.get(text);
    };
    
    // Petición GET para obtener los datos de la campaña y mostrarlos en el formulario para poder editar.
    if(idPushwooshCampaign) {
		utils.get('/api/pushwoosh_campaigns/'+idPushwooshCampaign, {}, function(response) {
			pushwoosh_campaign = response;
			$('#title').html(response.name);
			$('infinia-tabs')[0].addTab(0,response.name)
			utils.loadFormData(response);
			$(response).each(function(index, elem) {
				var i=0;
				$('.markup').each(function(index, elem) {
					$(elem).val(response.markups[i]);
					i++;
				});
			});
			
			// Comprobamos si la campaña está publicada o no, si lo está mostramos la pestaña 'Reporting' y 'Perfilado'.
			if(response.sendingStatus != 'SENDED') {
				$('#tab_reporting_campaign').hide();
				$('#tab_profile_campaign').hide();
			}
			else {
				$('#tab_reporting_campaign').show();
				$('#tab_profile_campaign').show();
			}
		});
	}
    else {
    	  $('h3#title').html(localize('push_notification_new'));
    }
});

$('#save-pushwoosh-campaign').on('click', function() {
	if(utils.validateRequired('campaign_pushwoosh-form')){
		var formData = utils.getFormAsObject('campaign_pushwoosh-form');
		var markups = [];
		$('.markup').each(function(index, elem){
			if($(elem).val())
				markups.push($(elem).val());
		});
		formData.markups = markups;
		
		if(idPushwooshCampaign) {
			formData.id = idPushwooshCampaign;
		}
		
		if(formData.idNotifications){
			formData.idNotifications = formData.idNotifications.split(',');
		}
		else {
			formData.idNotifications = [];
		}
		
		utils.post('/api/pushwoosh_campaigns', JSON.stringify(formData), function(response) {
			
			if(response.resultCode == 0) {
				utils.modal("Campaña pushwoosh creada", "La campaña se ha creado correctamente <br><br>"+
				"<a href='/pushwoosh_notifications/new?idPushwooshCampaign=" +
				response.id + "'>Añadir una notificación a la campaña</a><br><br>"+
				"<a href='/pushwoosh_campaigns/" + response.id + "'>Editar campaña pushwoosh</a><br><br>" +				
				"<a href='/pushwoosh_campaigns'>Volver a campañas pushwoosh</a><br><br>", {disableCloseButton: true});
			}				
		})
	}
});