
window.addEventListener('WebComponentsReady', function() {

	/* INIT TABLE */
	let filterObject = customElements.get('table-filter');
	let filter = new filterObject;
	filter.fields = [{name:"name"}];
	
	var circuitsTableManager = new TableManager('/api/retailers/'+id_retailer+'/circuits/');
	circuitsTableManager.setDiv($('#circuits-table-container'));
	circuitsTableManager.init('');
	circuitsTableManager.disableRowClick();
	$('#new-circuit').on('click', function() {
		utils.modal('Nuevo circuito', 
			'<div class="row"><div class="col-sm-12"><paper-input label="Nombre" id="circuit-name"></paper-input></div></div>'+
			'<div class="row mt20"><div class="col-sm-6"><file-loader accept="csv" id="csv-reader"></file-loader></div></div>'+
			'<div class="row mt20"><div class="col-sm-6"><button class="btn btn-primary" id="save-circuit">Crear</button></div></div>');
		
		$('#save-circuit').on('click', (e) => {			
			
			utils.lockScreen()
			$('#csv-reader')[0].uploadFiles('circuits').then(function(data) {
				let postinfo = {
					id:0,
					idLocations: [],
					idRetailer:id_retailer,
					fileUrl:data,
					name:$('#circuit-name').val()
				}
				
				utils.post('/api/circuits', JSON.stringify(postinfo), function(response) {
					utils.unlockScreen();
					circuitsTableManager.get();
					utils.floatingSuccess(localizer.get('saved'))
					$("#modal")[0].close();
				})
			})
			
			
		})
		
	})
	
});