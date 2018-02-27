

window.addEventListener('WebComponentsReady',function() {

	
	$('<a>',{text: localizer.get('init'), href:'/'+utils.getMainUrl()}).appendTo('.breadcrumbs');
	$('<a>',{text: localizer.get('agencies'),href: '/agencies'}).appendTo('.breadcrumbs');

	$('infinia-select[name="type"]')[0].options = [
		{id:"AGENCY", value:"AGENCY"}, 
		{id:"RESELLER", value:"RESELLER"}
	]

	var componentsPromise = new Promise((resolve, reject) => {
		utils.post("/api/components/selects", JSON.stringify({
			"fields":[
				{
					"id":"0",
					"field":"agencies"
				}
			]
		}), function(agencies) {
			var properties = [];

			for (var i=0; i<agencies[0].options.length; i++){
				properties.push({id:agencies[0].options[i].id, value:agencies[0].options[i].value});
			}
			$('#agencies')[0].setList(properties);
			
			resolve();
		});
	})
	
	
	if (id_agency){

		utils.get("/api/agencies/" + id_agency, {}, function(agency) {

			$('h3#title').html(agency.name);
			$("a.agency_name").text(agency.name);
			
			utils.loadFormData(agency);
			
			if(agency.type!="RESELLER")
				$('#agencies').hide();
			
			componentsPromise.then(function(){
				
				for (var i=0; i<agency.agencies.length; i++){
					document.querySelector('#agencies').accept({id:agency.agencies[i].id, value:agency.agencies[i].name});
				}
			})
			
			
			
		});
		

	}
	else {
		$('h3#title').html(localizer.get('agencyNew'));
	}
	
	$("input.form-control[name='name']").blur(function(){
		$("a.agency_name").text(this.value);
	});

	$('#save-agency').on('click', function() {
		var formData = utils.getFormAsObject('agency-form');
		formData.id = parseFloat(id_agency) || 0;
		var markups = [];
		$('.markup').each(function(index, elem){
			if($(elem).val())
				markups.push($(elem).val());
		})
		formData.markups = markups;
		
		var agencies = [];
		if($('infinia-select[name="type"]').val()=="RESELLER"){
			var props = $('#agencies')[0].getData();
			var exists = $.grep(props, function(elem){ 
				agencies.push(elem.id);
			});
		}
		
		formData.idAgencies=agencies;
		utils.post('/api/agencies', JSON.stringify(formData), function(response) {
			if(response.resultCode == 0) {
				utils.modal("Agencia creada", "La agencia se ha creado correctamente <br><br>"+
						"<a href='/agencies'>Volver a agencias</a><br><br>");
			}				
		});
	});
	
	utils.initStatusSelect();
});


$('infinia-select[name="type"]').on('change', (e) => {
	var type = e.currentTarget.value;
	if(type=="RESELLER")
		$("#agencies").show();
	else
		$("#agencies").hide();

});



	