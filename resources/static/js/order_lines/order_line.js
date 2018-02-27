
var idAdvertiser = "";
var idAgency = "";
var orderLine;
window.addEventListener('WebComponentsReady',function() {
	
	common.initSlider('slider');
	var formOptionsPromise = formOptions();
	
	$('#creatives').on('elem-added', function(e) {
		$('#creatives-weight').append(
				'<li data-id="'+e.detail.id+'"class="list-group-item" style="display:flex;justify-content:space-between;align-items:center;">'+
					'<span style="width:60%">'+e.detail.value+'</span><span><input class="weightValue" type="number" max="100" style="text-align:right;"/></span></li>');
		updateCreativesWeight();
	})
	
	$('#creatives').on('elem-removed', function(e) {
		$('#creatives-weight').find('li').each(function(index, elem) {
			if($(elem).data('id') == e.detail.id)
				$(elem).remove();
		})
		updateCreativesWeight();
	})
	
	function updateCreativesWeight() {
		let elems = $('#creatives')[0].getData().length;
		let fraction = Math.floor(Number(100 / elems));
		
		$('#creatives-weight').find('.weightValue').val(fraction);
		
		let mod = elems * fraction;
		if(100 - mod > 0)
			$('#creatives-weight').find('.weightValue').first().val(Number(fraction) + Number(100 - mod));
	}
	
	$('infinia-select[name="goalType"]').on('change', (e) => {
		var type = e.currentTarget.value;
		if (type === 'reach' || type === 'cpc' || type === 'cpe' || type === 'cpa' || type === 'cpm'){
			(document.querySelector('input[name="bidPrice"]').classList).add('required');
		}
		else {
			(document.querySelector('input[name="bidPrice"]').classList).remove('required');
		}
	});
	
	$('#inventory-formats').on('elem-removed', function(e){
		
		var props = $('#inventory-deals')[0].getList();
		var idSize = e.detail.id;
		propsRemoveAccept = $.grep(props, function(elem){ 
			return elem.idSize == idSize; 
		});
		propsRemoveAccept.forEach((item) => {
			$('#inventory-deals')[0].removeAccepted(item);
		})
		
		propsKeep = $.grep(props, function(elem){ 
			return elem.idSize != idSize; 
		});
		$('#inventory-deals')[0].setList(propsKeep.slice());
	});
	
	$('#inventory-formats').on('elem-added', function(e){
		var idSize = e.detail.id;
		utils.get('/api/deals/size/' + idSize, {}, function(deals) {
			var props = $('#inventory-deals')[0].getList();
			
			$.map(deals, (deal) => {
				var exists = $.grep(props, (elem) => { 
					return elem.id == deal.id; 
				});
				if (exists.length === 0){
					props.push({id: deal.id, value: deal.name+"("+e.detail.value+")", idSize : e.detail.id});
				}
			});
			$('#inventory-deals')[0].setList(props);
		});
	});
	
	// Setting breadcrumbs
	$('<a>',{text: 'Inicio'}).appendTo('.breadcrumbs');
	$('<a>',{text: 'Campañas',href: '/campaigns'}).appendTo('.breadcrumbs');


	utils.get('/api/campaigns/'+id_campaign, {}, function(response) {
		$('#title').html(response.name);
		idAdvertiser = response.idAdvertiser;
		idAgency = response.idAgency;
		
		if(!id_order_line) {
			$('#title').append(" - "+localizer.get("newOrderLine"));
			$('date-picker[name="startDate"]')[0].setValue(response.startDate);
			$('date-picker[name="endDate"]')[0].setValue(response.endDate);
			
			// Orderline data
			// Set max/min date for the date picker
			var minDate = new Date();
			minDate.setDate(minDate.getDate()-1);
			document.querySelector('date-picker[name="startDate"]').setMinDate(minDate);
			$('date-picker[name="startDate"]').on('dateSelected', (d) => {
				document.querySelector('date-picker[name="endDate"]').setMinDate(new Date(document.querySelector('date-picker[name="startDate"]').getValue()));
			});
		}
		
		// Add breadcrumbs
		$('<a>',{text: response.name,href: '/campaigns/'+response.id}).appendTo('.breadcrumbs');
		$('<a>',{text: "Líneas de pedido",href: '/campaigns/'+response.id+'/order_lines'}).appendTo('.breadcrumbs');
		
		utils.post("/api/components/selects", JSON.stringify({
			"fields":[
				{
					"id": idAdvertiser,
					"field":"creatives"
				}
			]
		}), function(result) {
			$('#creatives')[0].setList(result[0].options);
		});
		
		utils.post("/api/components/selects", JSON.stringify({
			"fields":[
				{
					"id": idAgency,
					"field":"clusters"
				}
			]
		}), function(result) {
			$('#cluster')[0].setList(result[0].options);
		});
	});
	
	
	
	$('infinia-select[name="budgetCappingType"]').on('change', function(e){
		var type = $(this).val();
		
		if (type === 'even' || type === 'asap'){
			$('#budgetCappingContainer').show();
			(document.querySelector('input[name="budgetCappingAmount"]').classList).add('required');
			(document.querySelector('infinia-select[name="budgetCappingTimeInterval"]').classList).add('required');
		}
		else {
			$('#budgetCappingContainer').hide();
			(document.querySelector('input[name="budgetCappingAmount"]').classList).remove('required');
			(document.querySelector('infinia-select[name="budgetCappingTimeInterval"]').classList).remove('required');
		}
	});
	$('infinia-select[name="impressionsCappingType"]').on('change', function(e){
		var type = $(this).val();
		
		if (type === 'even' || type === 'asap'){
			$('#impressionsCappingContainer').show();
			(document.querySelector('input[name="impressionsCappingAmount"]').classList).add('required');
			(document.querySelector('infinia-select[name="impressionsCappingTimeInterval"]').classList).add('required');
		}
		else {
			$('#impressionsCappingContainer').hide();
			(document.querySelector('input[name="impressionsCappingAmount"]').classList).remove('required');
			(document.querySelector('infinia-select[name="impressionsCappingTimeInterval"]').classList).remove('required');
		}
	});
	$('infinia-select[name="frequencyType"]').on('change', function(e){
		var type = $(this).val();
		
		if (type === 'even' || type === 'asap'){
			$('#frequencyContainer').show();
			(document.querySelector('input[name="frequencyAmount"]').classList).add('required');
			(document.querySelector('infinia-select[name="frequencyInterval"]').classList).add('required');
		}
		else {
			$('#frequencyContainer').hide();
			(document.querySelector('input[name="frequencyAmount"]').classList).remove('required');
			(document.querySelector('infinia-select[name="frequencyInterval"]').classList).remove('required');	
		}
	});
	
	$('.save-order-line').on('click', function() {
		
		if($('input[name="name"]').val().includes(',')) {
			utils.floatingError("El nombre no puede contener comas");
			$('input[name="name"]').addClass('has-error');
			return false;
		}
		
		// Save order line data
		if(utils.validateOrderLine('data-form')){
			
			var formData = utils.getFormAsObject('data-form');
			
			if (formData.cappingType === 'no-limit'){
				formData.cappingAmount = 0;
				formData.cappingTimeAmount = "";
				formData.cappingTimeUnit = "";
				formData.cappingFrequency = "";
			}
			
			if (formData.frequencyType === 'no-limit'){
				formData.frequencyAmount = 0;
				formData.frequencyTimeUnit = "";
				formData.frequencyFrequency = "";
			}
			
			utils.lockScreen();
			inventoryPromise().then(function(inventory) {
				
				var sizes = inventory.sizes;
				var deals = inventory.deals;
				var creatives = inventory.creatives;
				var supplies = inventory.supplies;
				var locations = inventory.locations;
				var dma = inventory.dma;
				var contextual = inventory.contextual;
				var clusters = inventory.clusters;
				var devices = inventory.devices;
				var connections = inventory.connections;
				var inventoryType = inventory.inventoryType;
				var browsers = inventory.browsers;
				var isp = inventory.isp;
				var sites = inventory.sites;
				var playerSize = inventory.playerSize;
				var linearFormat = inventory.linearFormat;
				var contentInitiation = inventory.contentInitiation;
				var audio = inventory.audio;
				
				var targetingData = {};
				
				// Location
				targetingData.idAcceptedLocationString = $.map(locations.accepted, (elem) => {
					return JSON.stringify(elem);
				});
				targetingData.idBlockedLocationString = $.map(locations.blocked, (elem) => {
					return JSON.stringify(elem);
				});
				
				// Clusters
				targetingData.idAcceptedClusters = $.map(clusters.accepted, (elem) => {
					return elem.id;
				});
				targetingData.idBlockedClusters = $.map(clusters.blocked, (elem) => {
					return elem.id;
				});
				
				// Devices
				targetingData.idAcceptedDeviceString = $.map(devices.accepted, (elem) => {
					return JSON.stringify(elem);
				});
				targetingData.idBlockedDeviceString = $.map(devices.blocked, (elem) => {
					return JSON.stringify(elem);
				});
				
				// Connections
				targetingData.idAcceptedConnections = $.map(connections.accepted, (elem) => {
					return elem.id;
				});
				targetingData.idBlockedConnections = $.map(connections.blocked, (elem) => {
					return elem.id;
				});
				
				// Contextual
				targetingData.idAcceptedContextualString = $.map(contextual.accepted, (elem) => {
					return JSON.stringify(elem);
				});
				targetingData.idBlockedContextualString = $.map(contextual.blocked, (elem) => {
					return JSON.stringify(elem);
				});
				
				// Inventory
				targetingData.idAcceptedInventoryType = $.map(inventoryType.accepted, (elem) => {
					return elem.id;
				});
				targetingData.idBlockedInventoryType = $.map(inventoryType.blocked, (elem) => {
					return elem.id;
				});
				
				// Browser
				targetingData.idAcceptedBrowsers = $.map(browsers.accepted, (elem) => {
					return elem.id;
				});
				targetingData.idBlockedBrowsers = $.map(browsers.blocked, (elem) => {
					return elem.id;
				});
				
				// Isp
				targetingData.idAcceptedIsp = $.map(isp.accepted, (elem) => {
					return elem.id;
				});
				targetingData.idBlockedIsp = $.map(isp.blocked, (elem) => {
					return elem.id;
				});
				
				// Sites
				targetingData.idAcceptedSites = $.map(sites.accepted, (elem) => {
					return elem.id;
				});
				targetingData.idBlockedSites = $.map(sites.blocked, (elem) => {
					return elem.id;
				});
				
				// Supply sources
				targetingData.idSuppliesString = $.map(supplies, (elem) => {
					return JSON.stringify({id : elem.id, value : elem.value});
				});
				
				// Deals
				formData.idDeals = $.map(deals, (elem) => {
					return elem.id;
				});
				
				// Formats
				formData.idSizes = $.map(sizes, (elem) => {
					return elem.id;
				});
				
				// Creatives
				var totalWeight =0;
				var creativesCounter = 0;
				formData.idCreatives = {};
				creatives.forEach((creative) => {
					$('#creatives-weight').find('li').each((index, li) => {
						if($(li).data('id') == creative.id) {
							weight = $(li).find('.weightValue').val();
							totalWeight+=Number(weight);
							formData.idCreatives[creative.id] = weight;
							creativesCounter++;
						}
					})
				})
				
				
				// Video
				targetingData.idAcceptedPlayerSize = $.map(playerSize.accepted, (elem) => {
					return elem.id;
				});
				targetingData.idBlockedPlayerSize = $.map(playerSize.blocked, (elem) => {
					return elem.id;
				});
				targetingData.idAcceptedLinearFormat = $.map(linearFormat.accepted, (elem) => {
					return elem.id;
				});
				targetingData.idBlockedLinearFormat = $.map(linearFormat.blocked, (elem) => {
					return elem.id;
				});
				targetingData.idAcceptedContentInitiation = $.map(contentInitiation.accepted, (elem) => {
					return elem.id;
				});
				targetingData.idBlockedContentInitiation = $.map(contentInitiation.blocked, (elem) => {
					return elem.id;
				});
				targetingData.idAcceptedAudio = $.map(audio.accepted, (elem) => {
					return elem.id;
				});
				targetingData.idBlockedAudio = $.map(audio.blocked, (elem) => {
					return elem.id;
				});
				
				// DayParts
				targetingData.dayPartsString = JSON.stringify(inventory.dayParts);
				
				targetingData.idCampaign = id_campaign;
				formData.idCampaign = id_campaign;
				if (id_order_line){
					targetingData.idOrderLine = id_order_line;
					formData.id = id_order_line;
				}
				
				formData.targeting = targetingData;
				
				if( ( totalWeight==100 && creativesCounter > 0) || creativesCounter == 0){
					let filesPromises = [];
					filesPromises.push($('file-loader[name="zipCodesFile"]')[0].uploadFiles('order_line'));
					filesPromises.push($('file-loader[name="coordinatesFile"]')[0].uploadFiles('order_line'));
					
					Promise.all(filesPromises).then((filesArray) => {
						
						targetingData.zipCodesFile = JSON.stringify(filesArray[0]);
						targetingData.coordinatesFile = JSON.stringify(filesArray[1]);
						
						utils.post('/api/order_lines', JSON.stringify(formData), function(response) {
							
							id_order_line = response.id;
							if(response.resultCode == 0) {
								utils.unlockScreen();
								utils.floatingSuccess('Guardado');
								
								/*utils.modal("Linea de pedido creada", "La linea de pedido se ha creado correctamente <br><br>"+
										"<a href='/campaigns/" + id_campaign + "/order_lines'>Volver a listado de líneas</a><br><br>"+
										"<a href='/order_lines/" + id_order_line + "?id_campaign=" + id_campaign + "'>Editar línea</a><br><br>"+
										"<a href='/campaigns/" + id_campaign + "'>Volver a la campaña</a><br><br>", {disableCloseButton:true});*/
							
							} else {
								utils.unlockScreen();
								utils.floatingError('Error');
							}
							
						}, function(error) {
							// Timeout error
							utils.unlockScreen();
							utils.modal("Guardando linea de pedido", "La linea de pedido se encuentra en proceso de guardado <br><br>"+
									"<a href='/campaigns/" + id_campaign + "/order_lines'>Volver a listado de líneas</a><br><br>"+
									"<a href='/campaigns/" + id_campaign + "'>Volver a la campaña</a><br><br>", {disableCloseButton:true});
						});
					})
					
				}else{
					alert('El porcentaje de las creatividades debe ser 100%. El porcentaje actual es: '+totalWeight);
					utils.unlockScreen();
	
				}
			});
		}
	});
	
	utils.lockScreen();
	
	getCampaign(id_campaign, function(campaign) {
		
		idAdvertiser = campaign.idAdvertiser;
		idAgency = campaign.idAgency;
		
		if(!id_order_line) {
			$('#title').append(" - "+localizer.get("newOrderLine"));
			$('date-picker[name="startDate"]')[0].setValue(campaign.startDate);
			$('date-picker[name="endDate"]')[0].setValue(campaign.endDate);
			
			// Orderline data
			// Set max/min date for the date picker
			var minDate = new Date();
			minDate.setDate(minDate.getDate()-1);
			document.querySelector('date-picker[name="startDate"]').setMinDate(minDate);
			document.querySelector('date-picker[name="endDate"]').setMinDate(minDate);
		}
		
		$('date-picker[name="startDate"]').on('dateSelected', (d) => {
			document.querySelector('date-picker[name="endDate"]').setMinDate(new Date(document.querySelector('date-picker[name="startDate"]').getValue()));
		});
		$('date-picker[name="endDate"]').on('dateSelected', (d) => {
			document.querySelector('date-picker[name="startDate"]').setMaxDate(new Date(document.querySelector('date-picker[name="endDate"]').getValue()));
		});
		
		
		
		let creativeListPromise = new Promise((resolveCreative, rejectCreative) => {
			utils.post("/api/components/selects", JSON.stringify({
				"fields":[
					{
						"id": idAdvertiser,
						"field":"creatives"
					}
				]
			}), function(result) {
				$('#creatives')[0].setList(result[0].options);
				resolveCreative();
			});
		})
		
		utils.post("/api/components/selects", JSON.stringify({
			"fields":[
				{
					"id": idAgency,
					"field":"clusters"
				}
			]
		}), function(result) {
			$('#cluster')[0].setList(result[0].options);
		});
	
		
		
		if (id_order_line){
			
				let olPromise = new Promise((resolveOLPromise, rejectOLPromise) => {
				
					getOrderLine(id_order_line, function(resp) {
					
						orderLine = resp;
						$('#title').html(orderLine.name);
						utils.loadFormData(orderLine);
						
						
						//Inventory formats and deals fill
						let olInventoryPromise = new Promise((resolveInventory, rejectInventory) => {
							//This promise finish when all the formats are loaded, then we set the accepted ones
							
								
								if(!orderLine.idSizes){
									resolveInventory();
									return;
								}
								
								
								let auxPromises = [];
								
								$.map(orderLine.idSizes, (idSize) => {
									utils.get('/api/sizes/' + idSize, {}, function(size) {
										// Add the deal format to the selected format list
										document.querySelector('#inventory-formats').accept({id: size.id, value: size.width + 'x' + size.height});
									});
								});
								
								$.map(orderLine.idDeals, (idDeal) => {
									auxPromises.push(new Promise((resolveAux, rejectAux) => {
										utils.get('/api/deals/' + idDeal, {}, function(deal) {
											// Add the deal format to the selected format list
											var props = $('#inventory-formats')[0].getData();
											var exists = $.grep(props, function(elem){ 
												return elem.id == deal.width + 'x' + deal.height; 
											});
											if (exists.length == 0){
												document.querySelector('#inventory-formats').accept({id: deal.width + 'x' + deal.height, value: deal.width + 'x' + deal.height});
											}
						
											// Add deal to selected deal list
											setTimeout(function() {
												document.querySelector('#inventory-deals').accept({id: deal.id, value: deal.name, size: deal.width + 'x' + deal.height});	
												resolveAux();
											}, 2500);
										});
									}))
								})
									
								Promise.all(auxPromises).then(() => {resolveInventory()});
							
						})
						
						
						let olCreativePromise = new Promise((resolveCP, rejectCP) => {
							creativeListPromise.then(() => {
								if(!orderLine.idCreatives || Object.keys(orderLine.idCreatives).length == 0) {
									resolveCP();
									return;
								}
								Object.keys(orderLine.idCreatives).forEach((key) => {
									document.querySelector('#creatives').accept({id: key});
									setTimeout(() => {
										if(orderLine.idCreatives[key] > 0) {
											$('#creatives-weight').find('li').each(function(index, elem) {
												if($(elem).data('id') == key)
													$(elem).find('.weightValue').val(orderLine.idCreatives[key]);
											})
										}
										resolveCP();
									}, 500)
								})
							})
						})
						
						let olClusterPromise = new Promise((resolveCP, rejectCP) => {
							
							if(!orderLine.idClusters) {
								resolveCP();
								return;
							}
							$.map(orderLine.idClusters, (idCluster) => {
								utils.get('/api/clusters/' + idCluster, {}, function(cluster) {
					
									// Add creative to selected creative list
									document.querySelector('#cluster').add({id: cluster.id, value: cluster.name});
									setTimeout(() => {
										$('#cluster')[0].updateAcceptedBlocked();
							    	}, 100)
								});
							});
						})
						
						
						if(resp.mediamathId && resp.mediamathId > 0) {
							$('date-picker[name="startDate"]')[0].disable();
							
							document.querySelector('date-picker[name="endDate"]').setMinDate(new Date(document.querySelector('date-picker[name="startDate"]').getValue()));
							
							$('infinia-select[name=type]')[0].disable();
							$('infinia-select[name=format]')[0].disable();
							$('infinia-select[name=goalType]')[0].disable();
						}
						
						Promise.all([olInventoryPromise, olCreativePromise, olClusterPromise]).then((resolves) => {
							resolveOLPromise();
						})
				});
			})	
			
			
			let olTargetingPromise = new Promise((resolveOLTPromise, rejectOLTPromise) => {
				
				getOrderLineTargeting(id_order_line, (orderLineTargeting) => {
					
					if (orderLineTargeting){
						formOptionsPromise.then(() => {
							let targetingPromises = [];
							// Add selected Accept/Block Devices
							$.map(orderLineTargeting.idAcceptedDeviceString, (accepted) => {
								$('multi-list-selector[id="device"]')[0].accept(JSON.parse(accepted));
							});
							$.map(orderLineTargeting.idBlockedDeviceString, (blocked) => {
								$('multi-list-selector[id="device"]')[0].block(JSON.parse(blocked));
							});
							
							// Add selected Accept/Block Connections
							setAcceptedAndBlocked($('list-accept-block[id="connection"]')[0], orderLineTargeting.idAcceptedConnections, orderLineTargeting.idBlockedConnections, document.querySelector('list-accept-block[id="connection"]').getList());
							
							// Add selected Accept/Block Inventory type
							setAcceptedAndBlocked($('list-accept-block[id="inventory"]')[0], orderLineTargeting.idAcceptedInventoryType, orderLineTargeting.idBlockedInventoryType, document.querySelector('list-accept-block[id="inventory"]').getList());
							
							// Add selected Accept/Block Browsers
							setAcceptedAndBlocked($('list-accept-block[id="browser"]')[0], orderLineTargeting.idAcceptedBrowsers, orderLineTargeting.idBlockedBrowsers, document.querySelector('list-accept-block[id="browser"]').getList());
							// Add selected Accept/Block ISP
							setAcceptedAndBlocked($('list-accept-block[id="isp"]')[0], orderLineTargeting.idAcceptedIsp, orderLineTargeting.idBlockedIsp, document.querySelector('list-accept-block[id="isp"]').getList());
							// Add selected Accept/Block Locations
							
							let locationPromise = new Promise((resolveLocation, rejectLocation) => {
									$.map(orderLineTargeting.idAcceptedLocationString, (accepted) => {
										$('multi-list-selector[id="location-widget"]')[0].accept(JSON.parse(accepted));
									});
									$.map(orderLineTargeting.idBlockedLocationString, (blocked) => {
										$('multi-list-selector[id="location-widget"]')[0].block(JSON.parse(blocked));
									});
									resolveLocation();
							})
							targetingPromises.push(locationPromise);
							
							let supplyPromise = new Promise((resolveSupply, rejectSupply) => {

								$.map(orderLineTargeting.idSuppliesString, (supply) => {
									document.querySelector('#supply-sources').accept({id: JSON.parse(supply).id, value: JSON.parse(supply).value});
								});
								resolveSupply();
								

							})
							targetingPromises.push(supplyPromise);
							
				        	
							// Add selected Accept/Block Player Size
							setAcceptedAndBlocked($('list-accept-block[id="playerSize"]')[0], orderLineTargeting.idAcceptedPlayerSize, orderLineTargeting.idBlockedPlayerSize, document.querySelector('list-accept-block[id="playerSize"]').getList());
							// Add selected Accept/Block Content Initiation
							setAcceptedAndBlocked($('list-accept-block[id="contentInitiation"]')[0], orderLineTargeting.idAcceptedContentInitiation, orderLineTargeting.idBlockedContentInitiation, document.querySelector('list-accept-block[id="contentInitiation"]').getList());
							// Add selected Accept/Block Audio
							setAcceptedAndBlocked($('list-accept-block[id="audio"]')[0], orderLineTargeting.idAcceptedAudio, orderLineTargeting.idBlockedAudio, document.querySelector('list-accept-block[id="audio"]').getList());
							// Add selected Accept/Block Linear Format
							setAcceptedAndBlocked($('list-accept-block[id="linearFormat"]')[0], orderLineTargeting.idAcceptedLinearFormat, orderLineTargeting.idBlockedLinearFormat, document.querySelector('list-accept-block[id="linearFormat"]').getList());
							// Add selected Accept/Block Supply sources
							
							// Add selected Accept/Block contextual
							$.map(orderLineTargeting.idAcceptedContextualString, (accepted) => {
								$('multi-list-selector[id="contextual"]')[0].accept(JSON.parse(accepted));
							});
							$.map(orderLineTargeting.idBlockedContextualString, (blocked) => {
								$('multi-list-selector[id="contextual"]')[0].block(JSON.parse(blocked));
							});
							// Add selected Accept/Block Providers
							var options = $('#inventory-adex').prop('list');
							setAcceptedAndBlocked($('list-accept-block[id="inventory-adex"]')[0], orderLineTargeting.idAcceptedProviders, orderLineTargeting.idBlockedProviders, options);
					
							// Add selected Accept/Block Geofence
							var options = $('#geofence').prop('options');
							setAcceptedAndBlocked($('accept-block[id="geofence-accept-block"]')[0], orderLineTargeting.idAcceptedGeoFence, orderLineTargeting.idBlockedGeoFence, options);
							
							// Add selected Accept/Block Clusters
							setAcceptedAndBlocked($('list-accept-block[id="cluster"]')[0], orderLineTargeting.idAcceptedClusters, orderLineTargeting.idBlockedClusters, document.querySelector('list-accept-block[id="cluster"]').getList());
		
							document.querySelector('time-table-selector').setData(JSON.parse(orderLineTargeting.dayPartsString));
							
							// Add selected Accept/Block Sites
							setAcceptedAndBlockedByValue($('accept-block[id="sites-accept-block"]')[0], orderLineTargeting.idAcceptedSites, orderLineTargeting.idBlockedSites);
							
							// Zip
							var $fileLoader = $('file-loader[name="zipCodesFile"]');
							$fileLoader[0].setFiles(orderLineTargeting.zipCodesFile);
							
							//coordinates
							var $fileLoaderCoord = $('file-loader[name="coordinatesFile"]');
							$fileLoaderCoord[0].setFiles(orderLineTargeting.coordinatesFile);
							
							Promise.all([targetingPromises]).then(() => {
								resolveOLTPromise();
							})
						
						})
						
						
					}
				});
				
			})
			
			Promise.all([olPromise, olTargetingPromise]).then(() => {
				utils.unlockScreen();
			})
		}
		else {
			utils.unlockScreen();
		}
		
		var goalTypeOptions = [
    	];
		
		if (campaign.goalType == 'openFormat'){
			goalTypeOptions = [
				{id:"openFormat", value:"CPM Spend"}
	    	];
		}else{
			goalTypeOptions = [
				{id:"spend", value:"CPM Premium"},
				{id:"cpm", value:"CPM Spend"}
	    	];
		}
		
		
		let accountData = JSON.parse(localStorage.accountData);
	  	if(accountData.userHeader.roleEntity.role.level <= 3) {
	  		
			if (campaign.goalType != 'openFormat'){
	  			goalTypeOptions = goalTypeOptions.concat([{id:"reach", value:"CPM REACH"}]);
			}
			if (campaign.goalType == 'cpc' || campaign.goalType == 'ctr' || campaign.goalType == 'vcr' || campaign.goalType == 'viewability_rate'|| campaign.goalType == 'vcpm'){
				goalTypeOptions = goalTypeOptions.concat([
					{id:"cpc", value:"CPC"},
					{id:"ctr", value:"CTR"},
					{id:"vcr", value:"Video Completion Rate"},
					{id:"viewability_rate", value:"Viewability Rate"},
					{id:"vcpm", value:"Viewable CPM"}
				]);
			}
			if (campaign.goalType == 'cpa'){
				goalTypeOptions = goalTypeOptions.concat([
					{id:"cpc", value:"CPC"},
					{id:"ctr", value:"CTR"},
					{id:"vcr", value:"Video Completion Rate"},
					{id:"viewability_rate", value:"Viewability Rate"},
					{id:"vcpm", value:"Viewable CPM"},
					{id:"cpa", value:"CPA"}]);
			}
			if (campaign.goalType == 'roi'){
				goalTypeOptions = goalTypeOptions.concat([
					{id:"cpc", value:"CPC"},
					{id:"ctr", value:"CTR"},
					{id:"vcr", value:"Video Completion Rate"},
					{id:"viewability_rate", value:"Viewability Rate"},
					{id:"vcpm", value:"Viewable CPM"},
					{id:"cpa", value:"CPA"},
					{id:"roi", value:"ROI"}]);
			}
	  	}
		
		document.querySelector('infinia-select[name="goalType"]').setOptions(goalTypeOptions);
		document.querySelector('infinia-select[name="goalType"]').setValue(campaign.goalType);
	});	
	
	

	function setAcceptedAndBlockedByValue(querySelector, acceptedValues, blockedValues){
		
		$.map(acceptedValues, (acceptedId) => {
			var p = acceptedId;
			
			if (p.length > 0){
				querySelector.accept({
					id : p,
					value : p
				});
			}
		});
		
		$.map(blockedValues, (blockedId) => {
			var p = blockedId;

			if (p.length > 0){
				querySelector.block({
					id : p,
					value : p
				});
			}
		});
	}
	
	
	function setAcceptedAndBlocked(querySelector, acceptedValues, blockedValues, options){
		
		$.map(acceptedValues, (acceptedId) => {
			var p = $.grep(options, function(opt){
				if (opt.id == acceptedId){
					return opt; 
				}
			});
			if (p.length > 0 && p[0].id && p[0].value){
				querySelector.accept({
					id : p[0].id,
					value : p[0].value
				});
			}
		});
		$.map(blockedValues, (blockedId) => {
			var p = $.grep(options, function(opt){
				if (opt.id == blockedId){
					return opt; 
				}
			});
			if (p.length > 0 && p[0].id && p[0].value){
				querySelector.block(p[0]);
			}
		});
	}
	
	function inventoryPromise() {
		var invPromise = new Promise((resolve, reject) => {
			// Once stored order line data, store inventory
			var inventory = {};
			
			inventory.sizes = $('#inventory-formats')[0].getData();
			inventory.deals = $('#inventory-deals')[0].getData();
			inventory.creatives = $('#creatives')[0].getData();
			inventory.supplies = $('#supply-sources')[0].getData();
			inventory.locations = $('#location-widget')[0].getData();
			inventory.clusters = $('#cluster')[0].getData();
			inventory.devices = $('#device')[0].getData();
			inventory.connections = $('#connection')[0].getData();
			inventory.contextual = $('#contextual')[0].getData();
			inventory.inventoryType = $('#inventory')[0].getData();
			inventory.browsers = $('#browser')[0].getData();
			inventory.isp = $('#isp')[0].getData();
			inventory.sites = $('#sites-accept-block')[0].getData();
			inventory.dayParts = document.querySelector('time-table-selector').getData();
			
			// Video
			inventory.playerSize = $('#playerSize')[0].getData();
			inventory.linearFormat = $('#linearFormat')[0].getData();
			inventory.contentInitiation = $('#contentInitiation')[0].getData();
			inventory.audio = $('#audio')[0].getData();
			
			resolve(inventory);
		});
		return invPromise;
	}
	
	function getCampaign(idCampaign, callback){
		utils.get('/api/campaigns/' + idCampaign, {}, callback);
	}
	
	function getOrderLine(idOrderLine, callback){
		utils.get('/api/order_lines/' + idOrderLine, {}, callback);
	}
	
	function getOrderLineTargeting(idOrderLine, callback){
		utils.get('/api/order_lines/' + idOrderLine + '/targeting', {}, callback);
	}
	
	function formOptions(){
		
		let formOptionsPromise = new Promise((resolveFormOptions, rejectFormOptions) => {
			
		let promisesList = [];
		
		document.querySelector('infinia-select[name="format"]').setOptions([
			{ id : 'DISPLAY', value : "Display" },
			{ id : 'VIDEO', value : "Video" }
		]);
		$('infinia-select[name="format"]').on('onRender', () => {
			document.querySelector('infinia-select[name="format"]').setValue("DISPLAY");
		});
		$('infinia-select[name="format"]').on('change', (e) => {
			var type = e.currentTarget.value;
    		if (type === 'VIDEO'){
    			$('#videoContainer').show();
    		}
    		else {
    			$('#videoContainer').hide();
    		}
		});
		
		document.querySelector('infinia-select[name="type"]').setOptions([
			{ id : 'AUD', value : "Audience Targeting (AUD)" },
			{ id : 'REM', value : "Remarketing (REM)" },
			{ id : 'GBO', value : "Goal-Based Optimization (GBO)" }
		]);
		$("infinia-select[name='type']").on('onRender', () => {
			document.querySelector('infinia-select[name="type"]').setValue("AUD");
		});

		var timing = [
			{ id : 'minute', value : "Minuto" },
			{ id : 'hour', value : "Hora" },
			{ id : 'day', value : "Día" },
			{ id : 'week', value : "Semana" },
			{ id : 'month', value : "Mes" },
			{ id : 'campaign', value : "Campaña" }
		];
		$('.unit-time').each(function(index, elem) {
			elem.setOptions(timing);
		});
		
		var timingDaily = [ {id:"day", value:"Día"}, {id:"hour", value:"Hora"}];
		$('.unit-daily').each(function(index, elem) {
			elem.setOptions(timingDaily);
		});
		
		// Inventario
		
		promisesList["inventory"] = new Promise((resolve, reject) => {
			utils.get('/api/sizes/all', {}, function(sizes) {
				var properties = $.map(sizes, (size) => {
					var prop = { id : size.id, value : size.width + 'x' + size.height };
					if (size.modifier){
						prop.value = prop.value + ' - (' + size.modifier.toUpperCase() + ')';
					}
					return prop;
				});
				$('#inventory-formats')[0].setList(properties);
				resolve();
			});
		})
		

		var providers = [{id:'4', value:'AppNexus'},
			{id:'8', value:'Ad exchange'},
			{id:'11', value:'Rubicon'},
			{id:'41', value:'Smart RTB'}
		];
		$('list-accept-block[id="inventory-adex"]').prop('list', providers);
		
		// Frequency and capping
		document.querySelector('infinia-select[name="budgetCappingType"]').setOptions([
			{id:'even', value:'EVEN'},
			{id:'asap', value:"ASAP"},
			{id:'no-limit', value:"No Cap"}
		]);
		$('infinia-select[name="budgetCappingType"]').on('onRender', () => {
			document.querySelector('infinia-select[name="budgetCappingType"]').setValue("no-limit");
		});
		document.querySelector('infinia-select[name="impressionsCappingType"]').setOptions([
			{id:'even', value:'EVEN'},
			{id:'asap', value:"ASAP"},
			{id:'no-limit', value:"No Cap"}
		]);
		$('infinia-select[name="impressionsCappingType"]').on('onRender', () => {
			document.querySelector('infinia-select[name="impressionsCappingType"]').setValue("no-limit");
		});
		document.querySelector('infinia-select[name="frequencyType"]').setOptions([
			{id:"asap", value:"ASAP"}, 
			{id:"even", value:"EVEN"}, 
			{id:"no-limit", value:"No Cap"}
		]);
		$('infinia-select[name="frequencyType"]').on('onRender', () => {
			document.querySelector('infinia-select[name="frequencyType"]').setValue("no-limit");
		});
    	
    	$('infinia-select[name="goalType"]').on('change', (e) => {
    		var type = e.currentTarget.value;
    		if (type === 'spend'  ){
    			$('#costsContainer').hide();
    			$('#budgetContainer').hide();
    			$('#goalValueContainer').hide();
    			$('#bidPriceContainer').hide();

    			$('#ol-tabs')[0].disableTab(1);


    		}
    		else {
    			var selectedDeals = $("#inventory-deals")[0].getData();
    			if (selectedDeals.length != 0){
	    			$('input[name="budget"]').val(0);
	    			$('input[name="goalValue"]').val(0);
	    			$('input[name="bidPrice"]').val(0);
    			}
    			
    			$('#costsContainer').show();
    			$('#budgetContainer').show();
    			$('#goalValueContainer').show();
    			$('#bidPriceContainer').show();
    			$('#contextualContainer').show();
    			if(type != ""){
        	    	$('#ol-tabs')[0].disableTab(1);

    			}
    		}
    		if (type === 'cpm'){
    			$('#contextualContainer').show();
    		}
    		else {
    			$('#contextualContainer').hide();
    		}
    		if(type === 'openFormat'){
    			$('#deal-container').hide();
        		$('#ol-tabs')[0].enableTab(1);
        		

    			$('#costsContainer').hide();
    			$('#budgetContainer').hide();
    			$('#goalValueContainer').hide();
    			$('#bidPriceContainer').hide();
    			
    			(document.querySelector('input[name="goalValue"]').classList).remove('required');
    			(document.querySelector('input[name="bidPrice"]').classList).remove('required');

    		}
    	});
    	
    	// Add selected Accept/Block Devices
		utils.get('/api/dimensions/DVCE', {}, function(response) {
			var data = $.map(response, (elem) => {
				return { id : elem.mediamathId, value : elem.name}
			});
			document.querySelector('multi-list-selector[id="device"]').addList(data);
		});

		// Add selected Accept/Block Connections
		utils.get('/api/dimensions/CSPD', {}, function(response) {
			var data = $.map(response, (elem) => {
				return { id : elem.mediamathId, value : elem.name}
			});
			document.querySelector('list-accept-block[id="connection"]').setList(data);
		});

		// Add selected Accept/Block Inventory type
		utils.get('/api/dimensions/INVT', {}, function(response) {
			var data = $.map(response, (elem) => {
				return { id : elem.mediamathId, value : elem.name}
			});
			$('infinia-select[name="format"]').on('change', (e) => {
				var type = e.currentTarget.value;
	    		if (type === 'VIDEO'){
	    			$('#videoContainer').show();
	    		}
	    		else {
	    			$('#videoContainer').hide();
	    		}
			});
			
			document.querySelector('infinia-select[name="type"]').setOptions([
				{ id : 'AUD', value : "Audience Targeting (AUD)" },
				{ id : 'REM', value : "Remarketing (REM)" },
				{ id : 'GBO', value : "Goal-Based Optimization (GBO)" }
			]);
			$("infinia-select[name='type']").on('onRender', () => {
				document.querySelector('infinia-select[name="type"]').setValue("AUD");
			});
	
			var timing = [
				{ id : 'minute', value : "Minuto" },
				{ id : 'hour', value : "Hora" },
				{ id : 'day', value : "Día" },
				{ id : 'week', value : "Semana" },
				{ id : 'month', value : "Mes" },
				{ id : 'campaign', value : "Campaña" }
			];
			$('.unit-time').each(function(index, elem) {
				elem.setOptions(timing);
			});
			
			var timingDaily = [ {id:"day", value:"Día"}, {id:"hour", value:"Hora"}];
			$('.unit-daily').each(function(index, elem) {
				elem.setOptions(timingDaily);
			});
			
			// Inventario
			
			promisesList.push(new Promise((resolve, reject) => {
				utils.get('/api/sizes/all', {}, 
					function(sizes) {
						var properties = $.map(sizes, (size) => {
							var prop = { id : size.id, value : size.width + 'x' + size.height };
							if (size.modifier){
								prop.value = prop.value + ' - (' + size.modifier.toUpperCase() + ')';
							}
							return prop;
						});
						$('#inventory-formats')[0].setList(properties);
						resolve();
					}, 
					function(){
						console.log("Inventory could not be charged");
					});
				})
			)
			
			//Supply sources
			promisesList.push(new Promise((resolveSupply, rejectSupply) => {
				utils.apiGet('/mediamath/supply_sources?sort_by=name', {}, function(response) {
						var data = $.map(response, (elem) => {
							return { id : elem.id, value : elem.name}
						});
						
						$('#supply-sources')[0].setList(data);
						resolveSupply();
						
					},
					function(){
						console.log("Supply could not be charged");
					});
				})
			)
	
			var providers = [{id:'4', value:'AppNexus'},
				{id:'8', value:'Ad exchange'},
				{id:'11', value:'Rubicon'},
				{id:'41', value:'Smart RTB'}
			];
			$('list-accept-block[id="inventory-adex"]').prop('list', providers);
			
			// Frequency and capping
			document.querySelector('infinia-select[name="budgetCappingType"]').setOptions([
				{id:'even', value:'EVEN'},
				{id:'asap', value:"ASAP"},
				{id:'no-limit', value:"No Cap"}
			]);
			$('infinia-select[name="budgetCappingType"]').on('onRender', () => {
				document.querySelector('infinia-select[name="budgetCappingType"]').setValue("no-limit");
			});
			document.querySelector('infinia-select[name="impressionsCappingType"]').setOptions([
				{id:'even', value:'EVEN'},
				{id:'asap', value:"ASAP"},
				{id:'no-limit', value:"No Cap"}
			]);
			$('infinia-select[name="impressionsCappingType"]').on('onRender', () => {
				document.querySelector('infinia-select[name="impressionsCappingType"]').setValue("no-limit");
			});
			document.querySelector('infinia-select[name="frequencyType"]').setOptions([
				{id:"asap", value:"ASAP"}, 
				{id:"even", value:"EVEN"}, 
				{id:"no-limit", value:"No Cap"}
			]);
			$('infinia-select[name="frequencyType"]').on('onRender', () => {
				document.querySelector('infinia-select[name="frequencyType"]').setValue("no-limit");
			});
	    	
	   
	    	
	    	promisesList.push(new Promise((resolve, reject) => {
	    		// Add selected Accept/Block Devices
	    		utils.get('/api/dimensions/DVCE', {},
		    		function(response) {
		    			var data = $.map(response, (elem) => {
		    				return { id : elem.mediamathId, value : elem.name}
		    			});
		    			document.querySelector('multi-list-selector[id="device"]').addList(data);
		    			resolve();
		    		},
		    		function(){
		    			console.log("Devices could not be charged");
		    			reject();
		    		});
	    		
	    	}))
	    	
	    	
	    	promisesList.push(new Promise((resolve, reject) => {
				// Add selected Accept/Block Connections
				utils.get('/api/dimensions/CSPD', {},
					function(response) {
						var data = $.map(response, (elem) => {
							return { id : elem.mediamathId, value : elem.name}
						});
						document.querySelector('list-accept-block[id="connection"]').setList(data);
						resolve();
					}, 
					function(){
						resolve()
					});
	    	}))
	    	
	    	promisesList.push(new Promise((resolve, reject) => {
				// Add selected Accept/Block Inventory type
				utils.get('/api/dimensions/INVT', {}, function(response) {
					var data = $.map(response, (elem) => {
						return { id : elem.mediamathId, value : elem.name}
					});
					document.querySelector('list-accept-block[id="inventory"]').setList(data);
					resolve();
				}, 
				function(){
					resolve()
				});
	    	}))
			
		
	    	promisesList.push( new Promise((resolve, reject) => {
				// Add selected Accept/Block Browsers
				utils.get('/api/dimensions/BSER', {}, function(response) {
					var data = $.map(response, (elem) => {
						return { id : elem.mediamathId, value : elem.name}
					});
					document.querySelector('list-accept-block[id="browser"]').setList(data);
					resolve();
				},
				function(){
					resolve()
				});
	    	}))
			
	    	promisesList.push( new Promise((resolve, reject) => {
				// Add selected Accept/Block ISP
				utils.get('/api/dimensions/ISPX', {}, function(response) {
					var data = $.map(response, (elem) => {
						return { id : elem.mediamathId, value : elem.name}
					});
					document.querySelector('list-accept-block[id="isp"]').setList(data);
					resolve();
				},
				function(){
					resolve()
				});
	    	}))
	    	
			
			// Add selected Accept/Block Locations
			promisesList.push(new Promise((resolve, reject) => {
				utils.get('/api/dimensions/REGN', {}, (response) => {
			
					var data = $.map(response, (elem) => {
						return { id : elem.mediamathId, value : elem.name}
					});
					document.querySelector('multi-list-selector[id="location-widget"]').addList(data);
					resolve();
				},
				function(){
					resolve()
				});
			}))
			
			// Video
			// Player Size
	    	promisesList.push(new Promise((resolve, reject) => {
				utils.get('/api/dimensions/VPSZ', {}, function(response) {
					var data = $.map(response, (elem) => {
						return { id : elem.mediamathId, value : elem.name}
					});
					document.querySelector('list-accept-block[id="playerSize"]').setList(data);
					resolve();
				},
				function(){
					resolve()
				});
			}))
	    	
	    	promisesList.push(new Promise((resolve, reject) => {
				// Linear Format
				utils.get('/api/dimensions/VLIN', {}, function(response) {
					var data = $.map(response, (elem) => {
						return { id : elem.mediamathId, value : elem.name}
					});
					document.querySelector('list-accept-block[id="linearFormat"]').setList(data);
					resolve();
				},
				function(){
					resolve()
				});
	    	}))
			// Content Initiation
			utils.get('/api/dimensions/VCON', {}, function(response) {
				var data = $.map(response, (elem) => {
					return { id : elem.mediamathId, value : elem.name}
				});
				document.querySelector('list-accept-block[id="contentInitiation"]').setList(data);
			});
			// Audio
			utils.get('/api/dimensions/VAUD', {}, function(response) {
				var data = $.map(response, (elem) => {
					return { id : elem.mediamathId, value : elem.name}
				});
				document.querySelector('list-accept-block[id="audio"]').setList(data);
			});
			
			contextualWidget();
			
			$('multi-list-selector[id="contextual"]').on('elemClicked', (item) => {
				contextualWidget(item.detail.id);
			});
			$('multi-list-selector[id="location-widget"]').on('elemClicked', (item) => {
				multiListSelectorWidget('location-widget', item.detail.id, 'REGN');
			});
			$('multi-list-selector[id="device"]').on('elemClicked', (item) => {
				multiListSelectorWidget('device', item.detail.id, 'DVCE');
			});
	
			Promise.all(promisesList).then(() => {
				resolveFormOptions();
			})
		});
		
		})
		return formOptionsPromise;
	}
	
	if(id_order_line){
		var tableManager = new TableManager('/api/order_lines/'+id_order_line+"/summary");
		
		tableManager.valueManager = function(item, elem) {
			var retValue = "";
			if(elem.value == 'dspStatus') {
					 retValue = localizer.get('dspStatusValues.'+item.value);
			}
			else
				retValue = item.value;
			
			return retValue;
		}
		
		tableManager.init();
	}
});


function multiListSelectorWidget(elemId, parentId, type){
	var url = '/mediamath/target_values?dimension=' + type;
	if (parentId){
		url += '&parent=' + parentId;
	}
	$("multi-list-selector[id='" + elemId + "']")[0].setLoader();
	utils.apiGet(url, {}, (response) => {

		if(response && response.length > 0){
			var data = $.map(response, (elem) => {
				return { id : elem.id, value : elem.name}
			});
			
			$("multi-list-selector[id='" + elemId + "']")[0].addList(data);
		}
		
		else {
			$("multi-list-selector[id='" + elemId + "']")[0].removeLoader();
		}
	});
}

function contextualWidget(parentId){
	var url = '/mediamath/targeting_segments';
	if (parentId){
		url += '?parent=' + parentId;
	}
	$("multi-list-selector[id='contextual']")[0].setLoader();
	utils.apiGet(url, {}, (response) => {
		if(response && response.length > 0){
			var data = $.map(response, (elem) => {
				var d = { id : elem.id, value : elem.name, hideAccept : true };
				d.hideAccept = !(elem.buyable && elem.buyable == true);
				d.hideBlock = !(elem.buyable && elem.buyable == true);
				return d;
			});
			$('multi-list-selector[id="contextual"]')[0].addList(data);

		}
		else {
			$("multi-list-selector[id='contextual']")[0].removeLoader();
		}
	});
}