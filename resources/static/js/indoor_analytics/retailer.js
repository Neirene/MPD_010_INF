window.addEventListener('WebComponentsReady',function() {
	
	$('<a>',{text: localizer.get('init'), href:'/'+utils.getMainUrl()}).appendTo('.breadcrumbs');
	$('<a>',{text: "Retailers", href: '/retailers'}).appendTo('.breadcrumbs');
	
	utils.initStatusSelect();
	
	if(id_retailer) {
		utils.lockScreen();
		utils.get('/api/retailers/' + id_retailer, {}, function(response) {
			$('#title,#retailer-name-breadcrumb').html(response.name);
			$('<a>',{text: response.name, href: '/retailers/'+response.id}).appendTo('.breadcrumbs');
			utils.loadFormData(response);
			utils.unlockScreen();
		})
	}
	
	let accountData = JSON.parse(localStorage.accountData);
	if(accountData.userHeader.roleEntity.role.role != "ROLE_ADMIN") {
		$('infinia-tabs')[0].removeTab(2)
		$('infinia-tabs')[0].removeTab(1)
	}

	
	clickEvents();
})


function clickEvents() {
	$('#save-retailer').on('click', function() {
		if(utils.validateRequired('retailer-form')) {
			$('#file-loader')[0].uploadFiles('logos').then((response) => {
				var formData = utils.getFormAsObject('retailer-form');
				formData.id = parseFloat(id_retailer) || 0;
				formData.logo = JSON.stringify(response);
				
				if (formData.idLocations && formData.idLocations !== ""){
					formData.idLocations = formData.idLocations.split(",");
				}
				else {
					formData.idLocations=[];
				}
				
				formData.trackerAdminPermission = Number(formData.trackerAdminPermission);
				formData.locationAdminPermission = Number(formData.locationAdminPermission);
				
				utils.post('/api/retailers', JSON.stringify(formData), function(response) {
					if(response.resultCode == 0) {
						utils.modal("Retailer creado", "El retailer se ha creado correctamente <br><br>"+
								"<a href='/retailers/" + response.id + "'>Editar retailer</a><br><br>" +
								"<a href='/retailers'>Volver a retailers</a><br><br>");
					}				
				});			
			});
		}
	});
}