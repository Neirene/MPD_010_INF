window.addEventListener('WebComponentsReady',function() {
	
	
	$('<a>',{text: localizer.get('init'), href:'/'+utils.getMainUrl()}).appendTo('.breadcrumbs');
	$('<a>',{text: localizer.get('advertisers'),href: '/advertisers'}).appendTo('.breadcrumbs');

	
	utils.initStatusSelect();
	utils.initIABSelect();
	var componentsPromise = new Promise((resolve, reject) => {
		utils.post("/api/components/selects", JSON.stringify({
			"fields":[
				{
					"id":JSON.parse(localStorage.accountData).userHeader.roleEntity.idEntity,
					"field":"agencies"
				}
			]
		}), function(agencies) {
			$('infinia-select[id="idAgency"]')[0].options = agencies[0].options;
			resolve();
		});
	})
	
	componentsPromise.then((resolve, reject) => {
		if (advertiserId){
			utils.get("/api/advertisers/" + advertiserId, {}, function(advertiser) {
				$('h3#title').html(advertiser.name);
				$("a.advertiser_name").text(advertiser.name);
				$('#file-loader').prop('imgUrl',advertiser.logo);
				utils.loadFormData(advertiser);
			});
		}
		else {
			$('h3#title').html(localizer.get('advertiser'));
		}
	})
	
	
	
	$("input.form-control[name='name']").blur(function(){
		$("a.advertiser_name").text(this.value);
	});

	
	
	$('#save-advertiser').on('click', function() {
		if(utils.validateRequired('advertiser-form')) {
			$('#file-loader')[0].uploadFiles('logos').then((response) => {
				var formData = utils.getFormAsObject('advertiser-form');
				formData.id = parseFloat(advertiserId) || 0;
				formData.logo = JSON.stringify(response);
				utils.post('/api/advertisers', JSON.stringify(formData), function(response) {
					if(response.resultCode == 0) {
						utils.modal("Anunciante creado", "El anunciante se ha creado correctamente <br><br>"+
								"<a href='/advertisers'>Volver a anunciantes</a><br><br>");
					}				
				});			
			});
		}
	});
})