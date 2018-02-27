window.addEventListener('WebComponentsReady',function() {
	id_user = utils.getUserId();
	
	$('infinia-select[name="country"]')[0].options = [
		{id:"ES", value:"ES"}, 
		{id:"MX", value:"MX"},
		{id:"CR", value:"CR"},
		{id:"CO", value:"CO"},
		{id:"CL", value:"CL"},
		{id:"AR", value:"AR"},
		{id:"PE", value:"PE"}
	];
	
	if(id_user) {
		utils.get('/api/users/'+id_user, {}, function(user) {
			if(user) {
				$('h3#title').html(user.username);
				$('<a>',{text: localizer.get('init'), href:utils.getMainUrl()}).appendTo('.breadcrumbs');
				
				$('#username').val(user.username);
				$('#email').val(user.email);
				$('infinia-select[name="country"]')[0].setValue(user.country);
			}
		});
	}
});

$('#save-changes-profile-user').on('click', function() {
	if(utils.validateRequired('user-profile-form')){
		var formData = utils.getFormAsObject('user-profile-form');
		
		if(id_user) {
			formData.id = id_user;
			utils.post('/api/users/password', JSON.stringify(formData), function(response) {				
				if(response.resultCode == 0) {
					utils.modal('Datos de usuario actualizados', 'Los datos del usuario se han actualizado.<br><br>');
				}
				else {
					switch(response.resultCode) {
						case -3:
							utils.modal('Datos de usuario incorrectos', 'Debe de introducir su antigua contraseña '+
							'para cambiarla por la nueva.<br><br>');
							break;
						case -7:
							utils.modal('Datos de usuario incorrectos', 'La contraseña antigua no es correcta.<br><br>');
							break;
					}
				}
			});
		}
	}
});