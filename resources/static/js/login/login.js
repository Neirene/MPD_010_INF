

var Login = function(){}
var login = new Login(); 

Login.prototype.login = function(formData) {
	
	utils.ajax('/login', formData, (response) => {
		let resp = JSON.parse(response);
		if(resp.resultCode == 0) {
			var initPage = resp.initPage;
			
			localStorage.setItem("accountData", JSON.stringify(resp));
			
			if(resp.redirectToInitPage) {
				window.location = initPage;
			}
			else {
				utils.modal(localizer.get("roles.select"), login.getRoleSelector(resp.userHeader.rolesEntities), {width:'40%', closeClick:true});
				
				$('#submit-role').on('click', function() {
					let split = $('#role-selector').val().split("##");
					resp.userHeader.rolesEntities.forEach(function(elem) {
						if(elem.role.role == split[0] && elem.idEntity == split[1]) {
							login.selectProfile(elem);
							return;
						}
					})
				})
			}
		}else if(resp.resultCode == -3) {
			alert("El usuario no tiene ningún rol asociado");
			
		}else {
			alert("Los datos introducidos no son correctos");
		}
	})
	
}

Login.prototype.selectProfile = function(elem) {
	utils.post('/api/users/profile', JSON.stringify(elem), function(response) {
		if(response.resultCode == 0) {
			localStorage.setItem("accountData", JSON.stringify(response));
			window.location = "/"+response.initPage;
		}
	})
}


// Login screen account type selection
Login.prototype.getRoleSelector = function(roleEntities) {
	
	var options = [];
	roleEntities.forEach((elem) => {
		options.push({id: elem.role.role+"##"+elem.idEntity, value: localizer.get("roles."+elem.role.role) + (elem.nameEntity ? " - "+elem.nameEntity : "") })
	})	

	var selectObj = customElements.get('infinia-select')
	var select = new selectObj();
	
	select.setOptions(options)
	select.id = "role-selector";
	let div = document.createElement("div");
	$(div).append("<p>"+localizer.get("roles.select")+"</p>");
	$(div).append(select);
	$(div).append('<div class="mt20 text-center"><button id="submit-role" class="btn btn-primary">'+localizer.get('submit')+'</button></div>')

	return div;
}



$('document').ready(() => {
	$('#login-form').on('submit', function(e) {
		e.preventDefault();
		if(utils.validateRequired('login-form')){
			var data = utils.getFormAsObject('login-form');
			login.login(data);
		}
	})
	
})
