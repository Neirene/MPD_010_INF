$('h3#title').html(localizer.get('cluster.new'));
$('<a>',{text: localizer.get('init'), href:utils.getMainUrl()}).appendTo('.breadcrumbs');
if(utils.getURLParam('outdoor')){
	$('<a>',{text: localizer.get('outdoor_analytics'),href: '/outdoor_analytics'}).appendTo('.breadcrumbs');
}
else {
	$('<a>',{text: localizer.get('Clusters'),href: '/clusters'}).appendTo('.breadcrumbs');
}
utils.lockScreen();
window.addEventListener('WebComponentsReady',function() {
	
	$('#loadCSV').on('click', function(e) {
		
		$('#csv_config_container').toggleClass('hidden');
		$('#frequency-configuration').toggleClass('hidden');
		
		if($('#frequency-configuration').hasClass('hidden')) {
			$(this).html(localizer.get('frequency'));
		}
			
		else
			$(this).html(localizer.get('loadCSV'));
	})
	
	
	
	
	
	
	//If editing, 
	if(id_cluster) {
		utils.get('/api/clusters/'+id_cluster, {}, function(response) {
			$('h3#title').html(response.name);
			
			if(!response.configuration) {
				utils.unlockScreen();
				return;
			}
			
			let conf = JSON.parse(response.configuration);
			$('input[name="name"]').val(response.name);
			
			if($('infinia-map[name="location"]')[0].$.csv_manager)
				$('infinia-map[name="location"]')[0].$.csv_manager.$.frequency_repeat.setValue(response.executionFrequency);
			
			let lockScreenPromises = []; 
			if(conf) {
				Object.keys(conf).forEach(function(key) {
					let section = conf[key];
					
					//Load lists				
					if(key !='apps' && $('selectable-list[name="'+key+'"]').length > 0) {
						if (key === 'interests' || key === 'keywords'){
							$('selectable-list[name="'+key+'"]')[0].setList(conf[key].accepted);
						}
						setTimeout(() => {
							$('selectable-list[name="'+key+'"]')[0].setAcceptedBlocked(conf[key]);
						}, 200);
					}
					
					if(key == 'app-categories') {
						if(conf[key].selected) {
							conf[key].selected.forEach(function(category) {
								lockScreenPromises.push(new Promise((resolveLockScreen, rejectLockScreen) => {
								
									setTimeout(() => {
										$('selectable-list[name="app-categories"]')[0].setSelected(conf[key].selected);
											loadAppsForCategory(category, function() {
												$('.app-category-list').each(function(index, appsList) {
													Object.keys(conf['apps']).forEach(function(categoryKey) {
														let k = categoryKey.replace("category-", "");
														if(k == appsList.idCategory) {
															appsList.setAcceptedBlocked(conf['apps'][categoryKey]);
														}
													})
													
												})
												resolveLockScreen();
											});
									}, 300)
								}))
							})
						}
					}
					
					//Load maps
					if($('infinia-map[name="'+key+'"]').length > 0) {
						conf[key].forEach((circle) => {
							
							
								if(circle.type == "circle")
									$('infinia-map[name="'+key+'"')[0].addCircle(circle.lat, circle.lng, Number(circle.rad)*1000);
								else if(circle.type == "poi")
									$('infinia-map[name="'+key+'"')[0].addPoi(circle.lat, circle.lng, Number(circle.rad)*1000, circle.category, circle.search);
							

						}) 
					}
					
					$('date-picker[name="locationDateFrom"]')[0].setValue(conf.frequency.dateFrom*1000);
					$('date-picker[name="locationDateTo"]')[0].setValue(conf.frequency.dateTo*1000);
					$('infinia-select[name="locationTimeFrom"]').val(conf.frequency.timeFrom);
					$('infinia-select[name="locationTimeTo"]').val(conf.frequency.timeTo);
					$('input[name="locationRepeatTimes"]').val(conf.frequency.repeatTimes);
					$('infinia-select[name="locationRepeatInterval"]').val(conf.frequency.repeatInterval);
					$('date-picker[name="tech-date-from"]')[0].setValue(conf.tech_date_from);
					$('date-picker[name="tech-date-to"]')[0].setValue(conf.tech_date_to);
				})
			}
			Promise.all(lockScreenPromises).then((result) => {
				utils.unlockScreen();
				updateConfig();
			})	
				
		});
			
		
	}
	else {
		$('selectable-list[name="keywords"]')[0].removeLoader();
		$('selectable-list[name="interests"]')[0].removeLoader();
		utils.unlockScreen();
	}
	common.initSlider('slider');
	
	/* Load selectors */
	utils.loadTimeSelectors();
	utils.loadHourSelectors();

	
	
	$('selectable-list[name="interests"]').on('filterList', (e) => {
		var val = e.detail;
		if (val.length >= 3){
			utils.get("/api/interests/iab/" + val, {}, function(interests) {
				var list = $.map(interests, (interest) => {
					return { id : interest.name, value : interest.name }
				});
				$('selectable-list[name="interests"]')[0].setList(list);
			});
		}
	});
	
	$('selectable-list[name="keywords"]').on('filterList', (e) => {
		var val = e.detail;
		if (val.length >= 3){
			utils.get("/api/interests/leiki/" + val, {}, function(keywords) {
				var list = $.map(keywords, (keyword) => {
					return { id : keyword.name, value : keyword.name }
				});
				$('selectable-list[name="keywords"]')[0].setList(list);
			});
		}
	});
	
	utils.post("/api/components/selects", JSON.stringify({
		"fields":[{"id":"0","field":"appCategory"}]
	}), function(categories) {
		$('selectable-list[name="app-categories"]')[0].addList(categories[0].options);
	});
	
	utils.fillTargetLists();
	
	/* Finish load selectors */
	
	/* Breadcrumb clicks */
	
	$('infinia-tabs').on('tabSelected', function(e) {
		if(e.detail == 2) {
			$('.homework').each((index, map)=> {
				map.init();
			})
			
			$('.homework').on('circleAdded circleRemoved', (e) => {
				updateConfig();
			})
		}
		else if(e.detail == 3) {
			$('.location').each((index, map)=> {
				map.init();
			})
			
			$('.location').on('circleAdded circleRemoved poisRemoved', (e) => {
				updateConfig();
			})
		}
	})
	
	/* End breadcrumb clicks */
	
	/*Set events */
	
	$('date-picker[name="locationDateFrom"]').on('dateSelected', function() {
		$('date-picker[name="locationDateTo"]')[0].setMinDate(new Date(this.getValue()));
	})
	
	$('#save-cluster').on('click', function() {
		
		if(utils.validateRequired('clusterForm')) {
		
			let config = {};
			
			$('selectable-list').each((index, elem) => {
				if(!$(elem).hasClass('app-category-list'))
					config[$(elem).attr('name')] = elem.getData();
				
				if($(elem).attr('name') == 'app-categories') {
					config[$(elem).attr('name')].selected = elem.selected;
				}
			})
			
			let apps = {};
			$('.app-category-list').each((index, elem) => {
				if(elem.getData().accepted.length > 0 || elem.getData().blocked.length > 0)
				apps["category-"+elem.idCategory] = elem.getData();
			})
			config.apps = apps;
			
			config.tech_date_from = $('date-picker[name="tech-date-from"]')[0].getValue();
			config.tech_date_to = $('date-picker[name="tech-date-to"]')[0].getValue();
			
			$('infinia-map').each((index, map) => {
				
				let points = [];
				let collection = map.circles;
				let type="circle";
				if(collection.length == 0 && map.pois.length > 0) {
					collection = map.pois;
					type="poi"
				}
				collection.forEach(function(elem) {
					let point = {lat:elem.center.lat(), lng: elem.center.lng(), rad:elem.radius/1000, type:type};
					if(type == "poi") {
						point.search = elem.search;
						point.category = elem.category;
					}
					if($(map).attr('name') == "csv-location") {
						point.category = 'csv-coords';
					}
					points.push(point);
				})

				config[$(map).attr('name')] = points;
				
			})
			
			let frequency = {};
			
			let df = $('date-picker[name="locationDateFrom"]')[0].getValue();
			let dt = $('date-picker[name="locationDateTo"]')[0].getValue() ;
			frequency.dateFrom = df ? df / 1000 : ""; 
			frequency.dateTo = dt? dt / 1000 : "";
			frequency.timeFrom = $('infinia-select[name="locationTimeFrom"]').val()
			frequency.timeTo = $('infinia-select[name="locationTimeTo"]').val()
			frequency.repeatTimes = $('input[name="locationRepeatTimes"]').val();
			frequency.repeatInterval = $('infinia-select[name="locationRepeatInterval"]').val();
			
			let error = false;
			if(frequency.dateFrom) {
				if(!frequency.dateTo) {
					$('date-picker[name="locationDateTo"]').addClass('has-error');
					error = true;
				}
				if(!frequency.timeFrom) {
					frequency.timeFrom = 0;
				}
				if(!frequency.timeTo) {
					frequency.timeTo = 23;
				}
				
				
				if((parseInt(frequency.timeTo) < parseInt(frequency.timeFrom))) {
					utils.floatingError("La hora de fin no puede ser mayor que la de inicio");
					$('infinia-select[name="locationTimeTo"]').addClass('has-error');
					$('infinia-select[name="locationTimeFrom"]').addClass('has-error');
					error = true;
					return;
				}
			}
			
			if(frequency.repeatInterval) {
				if(!frequency.repeatTimes){
					$('input[name="locationRepeatTimes"]').addClass('has-error');
					error = true;
				}
			}
			
			if(error) {
				utils.floatingError("Faltan campos obligatorios");
				return;
			}
			config.frequency = frequency;
			
			
			let data = {
					configuration : JSON.stringify(config),
					name : $('input[name="name"]').val(),
					clusterStatus : 'created',
					schedule : 0,
					emrConfig : 'clusterization',
					createDate: new Date().getTime(),
					id:id_cluster
			};

			if($('infinia-map[name="location"]')[0].$.csv_manager && 
					$($('infinia-map[name="location"]')[0].$.csv_manager.$.frequency_repeat).val()) {
				data.executionFrequency  = $($('infinia-map[name="location"]')[0].$.csv_manager.$.frequency_repeat).val();
			}
			
			if(utils.getURLParam('outdoor'))
				data.clusterType='OUTDOOR';
			else
				data.clusterType='CLUSTER';
			utils.lockScreen();
			
			utils.post('/api/clusters', JSON.stringify(data), 
			function(response) {
				resultModal(response)
			},
			function(response){
				resultModal(response)
			});	
			
			function resultModal(response) {
				let cid = id_cluster;
				if(!id_cluster) {
					cid = response.id;
				}
				if(utils.getURLParam('outdoor')){
					utils.modal("Cluster creado", "El cluster se ha creado correctamente <br><br>"+
							"<a href='/outdoor_analytics'>Volver a clusters</a><br><br>" +
							"<a href='/outdoor_analytics/" + cid+ "?outdoor=true'>Editar cluster</a><br><br>");
				}
				else {
					utils.modal("Cluster creado", "El cluster se ha creado correctamente <br><br>"+
						"<a href='/clusters'>Volver a clusters</a><br><br><a href='/clusters/" + cid+ "'>Editar cluster</a><br><br>");
				}
				utils.unlockScreen();
			}
		}
	})
	
	setSelectableEvents();
	
	//Apps list clicks	
	$('selectable-list[name="app-categories"]').on('elemClicked', function(e) {
		loadAppsForCategory(e.detail);		
	})
	
	
	function loadAppsForCategory(e, callback) {
		let exists = false;
		$('#apps-lists-container').children().each((index, elem) => {
			if(elem.idCategory == e.id) {
				exists = true;
				return false;
			}			
		})
		
		if(!exists) {
			let SelList = customElements.get('selectable-list');
			let list = new SelList();
			list.className = 'app-category-list';
			list.hideBlock = "true";
			list.hideAccept = "true";
			list.idCategory = e.id;
			let div = document.createElement('div');
			div.className = "col-sm-6 mt20";
			
			
			span = document.createElement('span');
			span.className="pb10";
			$(span).html(e.value); 
			$(div).append(span);
			$(div).append(list);
			$('#apps-lists-container').append(div);
			
			let id = e.id;
			utils.post("/api/components/selects", JSON.stringify({
				"fields":[{"id":id,"field":"apps"}]
			}), function(categories) {
				list.addList(categories[0].options);
				setSelectableEvents();
				setTimeout(() => {
					if(typeof callback == "function")
						callback();
				}, 200)
			});
		}
	}
	
	$('selectable-list[name="app-categories"]').on('elemUnClicked', function(e) {
		$('#apps-lists-container').children().each((index, elem) => {
			if($(elem).find('selectable-list')[0].idCategory == e.detail.id) {
				$(elem).remove();
				updateConfig();
			}
		})
	})
	
	//End app clicks

	var timing = [{id:"month", value:localizer.get('month')}, {id:"week", value:localizer.get('week')}, {id:"quarter", value:localizer.get('quarter')}];
	$('infinia-select[name="locationRepeatInterval-csv"]').each(function(index, elem) {
		elem.options = timing;
	});
	
	localizer.translate();
	
	
	$('.validate-cluster').on('click', function() {
    	utils.validateCluster(id_cluster);

	})
	utils.checkValidateCluster();
	

	
})


//Functions
function setSelectableEvents() {	
	$('selectable-list').on('itemAccepted itemBlocked acceptedRemoved blockedRemoved', (e) => {
		updateConfig();
	})
}

function updateConfig() {
	$('#cluster-configuration').empty();
	
	let apps = 0;
	$('selectable-list').each((index, elem) => {
		
		
		if($(elem).hasClass('app-category-list')) {
			apps += elem.getData().accepted.length;
		}
		else {
			
			if(elem.getData().accepted.length > 2) {
				let text = localizer.get($(elem).attr('name')) +" ("+elem.getData().accepted.length+")";
				appendHTML(text, () => {
					elem.removeAllAccepted();
					updateConfig();
				});

			}
			else {
				elem.getData().accepted.forEach((el) => {					
					let text = localizer.get($(elem).attr('name')) +" - "+ el.value;
					appendHTML(text, () => {
						elem.removeAccepted(el);
						updateConfig();
					});
				})
			}
		}
	})
	if(apps > 0) {
		appendHTML("Apps ("+apps+")", () => {
			$('.app-category-list').each(function(index, list) {
				list.removeAllAccepted();
			})
			
			updateConfig();
		});
	}
	
	$('infinia-map').each((index, map) => {
		
		
		if(map.pois.length > 0 && map.circles.length == 0) {
			let counter = {};
			map.pois.forEach((elem) => {
				let key = elem.category+" - "+elem.search;
				if(counter[key]) counter[key]++;
				else counter[key] = 1;
			})
			let text;
			Object.keys(counter).forEach((key) => {
				text =  localizer.get(map.id.replace("-map", "")) + " - " + key + ": " + counter[key].toLocaleString();
				appendHTML(text, () => {
					$('#'+map.id)[0].clearPois(key);
					updateConfig();
				});
			})
		}
		else if (map.circles.length > 0){
			let text = localizer.get(map.id.replace("-map", "")) +" ("+map.circles.length.toLocaleString()+")";
			appendHTML(text, () => {
				$('#'+map.id)[0].clearCircles();
				updateConfig();
			});
		}
	})
	
	function appendHTML(text, onRemove) {
		let Icon = customElements.get('iron-icon');
		let icon = new Icon();
		icon.setAttribute('icon',"icons:close");
		icon.onclick = onRemove;
		icon.className="cursor-pointer";
		let li = document.createElement("LI");
		li.className = "list-group-item flex space-between";
		
		let span = document.createElement("SPAN");
		span.innerHTML = text;
		li.appendChild(span);
		li.appendChild(icon);
		$('#cluster-configuration').append(li);
	}
	
}

	
	





