
window.addEventListener('WebComponentsReady', function() {

	/* INIT TABLE */
	let filterObject = customElements.get('table-filter');
	let filter = new filterObject;
	filter.fields = [{name:"name"}];
	
	var locationsTableManager = new TableManager('/api/retailers/' + id_retailer + '/locations');
	
	locationsTableManager.valueManager = function(item, elem) {
		var retValue = "";
		if(elem.value == 'status') {
				 retValue = localizer.get('statusType.'+item.value);
		}
		else
			retValue = item.value;
		
		return retValue;
	}
	
	locationsTableManager.init('location-actions', filter);
	locationsTableManager.editUrl = function(e){
		window.location = '/locations/'+e.detail+'?id_retailer='+id_retailer;
	}
	
	$('#new-location').on('click', function(e) {
		
		utils.fileAjax('/locations/new',{}, function(response) {
			utils.modal("Nueva localización", response);
			utils.initStatusSelect();
			
			
			
			
			$('#save-location').on('click', function() {
				if(utils.validateRequired('location-form')) {
					var formData = utils.getFormAsObject('location-form');
					formData.id = parseFloat(id_location) || 0;
					formData.idRetailer = id_retailer;
					
					if (formData.idTrackers && formData.idTrackers !== ""){
						formData.idTrackers = formData.idTrackers.split(",");
					}
					else {
						formData.idTrackers=[];
					}
					if (formData.idBeacons && formData.idBeacons !== ""){
						formData.idBeacons = formData.idBeacons.split(",");
					}
					else {
						formData.idBeacons=[];
					}
					if (formData.idPlayers && formData.idPlayers !== ""){
						formData.idPlayers = formData.idPlayers.split(",");
					}
					else {
						formData.idPlayers=[];
					}
					
					utils.lockScreen();
					utils.post('/api/locations', JSON.stringify(formData), function(response) {
						utils.floatingSuccess(localizer.get('saved'))
						utils.unlockScreen();
						locationsTableManager.get();
						utils.closeModal();
					});	
					
				}
			});
			
			
		})
		
	})
	
});

