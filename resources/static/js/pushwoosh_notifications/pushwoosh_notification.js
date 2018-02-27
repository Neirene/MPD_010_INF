window.addEventListener('WebComponentsReady',function() {
	utils.getMainUrl();
	
	var notification;
	
	utils.get('/api/pushwoosh_campaigns/' + idPushwooshCampaign, {}, function(response) {
		// Add breadcrumbs
		$('<a>',{text: localizer.get('init'), href: utils.getMainUrl()}).appendTo('.breadcrumbs');
		$('<a>',{text: 'Campañas pushwoosh',href: '/pushwoosh_campaigns'}).appendTo('.breadcrumbs');
		$('<a>',{text: response.name, href: '/pushwoosh_campaigns/'+response.id}).appendTo('.breadcrumbs');
		$('<a>',{text: "Notificaciones pushwoosh", href: '/pushwoosh_campaigns/' + response.id +
		'/pushwoosh_notifications'}).appendTo('.breadcrumbs');
	});
	
	utils.post("/api/components/selects", JSON.stringify({
		"fields": [
			{
				"id" : "0",
				"field" : "clusters_pushwoosh_notifications"
			}
		]
	}), 
	function(clusters) {
		document.querySelector('infinia-select[name="clusterId"]').setOptions(clusters[0].options);
	});
	
	if(!idPushwooshNotification) {
		$('#title').append("Notificación pushwoosh");
		
		// Input ignoreUserTimezone.
	    $('#ignoreUserTimezone').bootstrapToggle('disable');
	    
	    // Date-picker sendDate.
	    $('date-picker[name="sendDate"]').hide();	    	    
	}
	else {
		utils.get('/api/pushwoosh_notifications/' + idPushwooshNotification, {}, function(response) {
			$('#title').html(response.content);
			notification = response;
			
			//TODO: Rellenar los campos del formulario con los datos que tengamos de la notificación.
			utils.loadFormData(response);						
			
			if(notification.sendingStatus == 'SENDED') {
				$('#notification_pushwoosh-form :input').attr('disabled', true);
				$('#save-notification-push').hide();
				$('#icon-loader')[0].disable();
				$('#banner-loader')[0].disable();
			}
			
			// Rellenamos los datos del icono y del banner.
			if(response.icon) {
				var fileIcon = JSON.stringify([JSON.parse(response.icon)]);
				$('#icon-loader')[0].setFiles(fileIcon);
			}
			
			if(response.banner) {
				var fileBanner = JSON.stringify([JSON.parse(response.banner)]);
				$('#banner-loader')[0].setFiles(fileBanner);
			}
			
			// Relleno de los campos de enviar ahora, enviar en y ignorar zona horaria del usuario.
			if(response.selectDate == 'NOW') {
				$('input[value="now"]').attr('checked', 'checked');
				$('date-picker[name="sendDate"]').hide();
				
				// Clear datepicker.
				$('date-picker[name="sendDate"]').val('');
				$('date-picker[name="sendDate"]').prop('hour', '');
				$('date-picker[name="sendDate"]').prop('min', '');
			}
			else {
				$('input[value="dateToSelect"]').attr('checked', 'checked');
				$('date-picker[name="sendDate"]').show();
				
				// Habilitamos el botón de 'ignoreUserTimezone' y le activamos o no dependiendo del valor 
				// seleccionado en la creación de la notificación.
				$('#ignoreUserTimezone').bootstrapToggle('enable');
				
				if(response.ignoreUserTimezone) {
					$('#ignoreUserTimezone').bootstrapToggle('on');
				}
				else {
					$('#ignoreUserTimezone').bootstrapToggle('off');
				}
			}
			
			if((response.link == '' || response.link == null) && 
			(response.remotePage == '' || response.remotePage == null)) {
				$('input[value="openApp"]').attr('checked', true);
				$('input[value="url"]').attr('checked', false);
				$('input[value="richMedia"]').attr('checked', false);
			}
			else {
				if(response.link != '' && response.link != null) {
					$('input[value="url"]').attr('checked', true);
					$('#textURL').css('display', 'block');
					$('#textRichMedia').css('display', 'none');
				}
				else if(response.remotePage != '' && response.remotePage != null) {
					$('input[value="richMedia"]').attr('checked', true);
					$('#textURL').css('display', 'none');
					$('#textRichMedia').css('display', 'block');
				}
			}
			
			if(response.sendRate) {
				$('#check_send_rate').prop('checked', true);
				$('#sendRate').val(response.sendRate);
				$('input[name="sendRate"]').prop('disabled', false);
			}
			else {
				$('#check_send_rate').prop('checked', false);
				$('#sendRate').val(1000);
				$('input[name="sendRate"]').prop('disabled', true);
			}				
			
			if(response.aSound)
				$('#sound').bootstrapToggle('on');
			else
				$('#sound').bootstrapToggle('off');
			
			if(response.aVibration)
				$('#vibration').bootstrapToggle('on');
			else
				$('#vibration').bootstrapToggle('off');
			
			if(response.aPriority) {
				$('input[name="aPriority"]').val(response.aPriority);
				$('#android_priority')[0].value = response.aPriority;
				getTextPriority(response.aPriority);
			}
			
			if(response.aGcmTtl) {
				$('input[name="aGcmTtl"]').val(response.aGcmTtl);
				$('#expiration_time')[0].value = getValueExpirationTime(response.aGcmTtl);
				getTextExpirationTime(response.aGcmTtl);
			}
			
			if(response.radius && response.lat && response.lng && response.name) {
				$('#setGeozone').bootstrapToggle('on');
				
				// Habilitamos el mapa y posicionamos la geozona creada.
				$('#map_geozone').removeClass('hidden');
							
				openMap = !openMap;
				initAutocomplete();
			}
			
			if(response.clusterId != "") {
				setTimeout(function() {
					document.querySelector('infinia-select[name="clusterId"]').setValue(response.clusterId);
				}, 200);
			}
		});
	}
	
	
});

$('.showSelector').on('click', function() {
	$('.showSelector').removeClass('active');
	$(this).addClass('active');
	let container = $(this).data('section');
	$('div[id$="-container"]').addClass('hidden');
	$('#' + container + '-container').removeClass('hidden');		
});

$('#icon-loader').on('fileSelected', () => {
	$('#icon-loader #logo-container').empty();
});

$('#banner-loader').on('fileSelected', () => {
	$('#banner-loader #logo-container').empty();
});

$('infinia-select[name="clusterId"]').on('change', function(e){
	utils.post("/api/components/selects", JSON.stringify({
		"fields": [
			{
				"id" : "0",
				"field" : "clusters_pushwoosh_notifications"
			}
		]
	}), 
	function(clusters) {
		document.querySelector('infinia-select[name="clusterId"]').setOptions(clusters[0].options);				
	});
});

$('#save-notification-push').on('click', function() {
	var promisesArray = [];
	
	if($('#icon-loader')[0].hasFiles()) {
		promisesArray.push($('#icon-loader')[0].uploadFiles('logos'));
	}
	
	if($('#banner-loader')[0].hasFiles()) {
		promisesArray.push($('#banner-loader')[0].uploadFiles('logos'));
	}
	
	Promise.all(promisesArray).then(values => {
		if(utils.validateRequired('notification_pushwoosh-form')) {
	        var formData = utils.getFormAsObject('notification_pushwoosh-form');

	        // TODO: Obtener los datos del formulario y mandarlos al servicio.
	        if(idPushwooshNotification) {
	        		formData.id = idPushwooshNotification;
	        }
	        
	        formData.idPushwooshCampaign = idPushwooshCampaign;
	        
	        if(!formData.ignoreUserTimezone || formData.ignoreUserTimezone == "off") {
	        		formData.ignoreUserTimezone = false;
	        }
	        else {
	        		formData.ignoreUserTimezone = true;
	        }
	        
	        if(!formData.aSound || formData.aSound == "off")
	        		formData.aSound = false;
	        else
	        		formData.aSound = true;
	        
	        if(!formData.aVibration || formData.aVibration == "off")
        			formData.aVibration = false;
	        else
	        		formData.aVibration = true;
	        
	        // Comprobamos si el botón de geozone está activado, si no lo está eliminamos los campos que pertenecen a este apartado.
	        if(!formData.setGeozone || formData.setGeozone == "off") {
		        	delete formData['radius'];
	        		delete formData['lat'];
	        		delete formData['lng'];
	        		delete formData['name'];
	        }
	        
	        if(formData.aLed == "#ffffff")
	        		delete formData['aLed']
	        
	        if(formData.aIbc == "#ffffff")
        			delete formData['aIbc']
	        
	        if(formData.optradioTimeSendMessage && formData.optradioTimeSendMessage == 'dateToSelect') {
	        		formData.selectDate = 'SELECTED_DATE';
	        		
	        		//Get name timezone user client.
	        		formData.timezone = jstz.determine().name();
	        }
	        else {
	        		formData.selectDate = 'NOW';
	        		delete formData['sendDate'];
	        }	       	       
	        
	        /* 
	         * Si la opción de 'Acción' está marca 'openApp' ponemos a null los campos de remotePage y link por
	        	 * si el usuario los ha dejado con datos.
	        */
	        if(formData.optradioActionApp && formData.optradioActionApp == 'openApp') {
	        		formData.remotePage = null;
	        		formData.link = null;
	        }
	        
	        // Asignamos las url's del icono y el banner a sus respectivos campos del formulario a mandar.
	        if(values && values[0] && values[0][0])
	        		formData.icon = JSON.stringify(values[0][0]);
	        
	        if(values && values[1] && values[1][0])
	        		formData.banner = JSON.stringify(values[1][0]);
	        
	        // Comprobamos si el check de tasa de envío está checkeado, si no lo está. Eleminaremos el campo sendRate del formData.
	        if(!$('#check_send_rate').is(':checked'))
	        		delete formData['sendRate']
	        	        	        
	        // Limpieza de campos innecesarios.
	        delete formData['optradioTimeSendMessage'];
	        delete formData['optradioActionApp'];
	        
	        //Convertimos los valores a enviar a su formato correcto.
	        if($('#check_send_rate').is(':checked')) {
	        		formData.sendRate = Number($('#sendRate').val());
	        }
	        
	        if(formData.radius)
	        		formData.radius = Number(formData.radius);
	        
	        if(formData.aBadges)
        			formData.aBadges = Number(formData.aBadges);
	        
	        if(formData.aGcmTtl)
	        		formData.aGcmTtl = Number(formData.aGcmTtl);
	        
	        if(formData.aPriority)
        			formData.aPriority = Number(formData.aPriority);
	        
        		formData.sendingStatus = 'PENDING';
	        
	        utils.post('/api/pushwoosh_notifications', JSON.stringify(formData), function(response) {
	    			if(response.resultCode == 0) {
	        			utils.modal("Notificación pushwoosh creada", "La notificación se ha creado correctamente <br><br>"+
					"<a href='/pushwoosh_campaigns/" + idPushwooshCampaign + 
					"/pushwoosh_notifications'>Volver a listado de notificaciones</a><br><br>"+
					"<a href='/pushwoosh_notifications/" + idPushwooshNotification + "?id_pushwoosh_campaign=" + 
					idPushwooshCampaign + "'>Editar notificación pushwoosh</a><br><br>"+
					"<a href='/pushwoosh_campaigns/" + idPushwooshCampaign + 
					"'>Volver a la campaña pushwoosh</a><br><br>", {disableCloseButton: true});
	        		}
	        });
	    }
	});    
});

$('input[name="optradioTimeSendMessage"]').on('change', function() {
	if($(this).is(":checked")) {
		if($(this).val() == "dateToSelect") {
			$('date-picker[name="sendDate"]').show();
			$('#ignoreUserTimezone').bootstrapToggle('enable');
		}
		else {
			$('date-picker[name="sendDate"]').hide();
			$('#ignoreUserTimezone').bootstrapToggle('disable');
		}
	}
});

$('#check_send_rate').change(function() {
	if($(this).is(":checked")) {
		$('#sendRate').prop("disabled", false);
	}
	else {
		$('#sendRate').prop("disabled", true);
	}
});

$('#sendRate').on('change', function() {
	if($(this).val() > 1000)
		$(this).val(1000);
	else if($(this).val() < 100)
		$(this).val(100);
});

$('#setGeozone').on('change', function() {
	if($(this).prop('checked')) {
		$('#map_geozone').removeClass('hidden');
		if(!openMap) {			
			openMap = !openMap;
			initAutocomplete();
		}
	}
	else
		$('#map_geozone').addClass('hidden');
});

$('input[name="optradioActionApp"]').on('change', function() {
	switch(this.value) {
		case "openApp":
			$("#textURL").css("display", "none");
			$("#textRichMedia").css("display", "none");			
			break;
			
		case "url":
			$("#textURL").css("display", "block");
			$("#textRichMedia").css("display", "none");
			break;
			
		case "richMedia":
			$("#textURL").css("display", "none");
			$("#textRichMedia").css("display", "block");
			break;
	};
});

// Event change of component 'paper-slider' of android priority.
$('#android_priority').on('immediate-value-change', function() {
	switch( $(this)[0].immediateValue ) {
		case 0:
			$('input[name="aPriority"]').val(0);
			$('#text_android_priority').html("<b>everything else</b> (and all legacy notification)");
			break;
			
		case 1:
			$('input[name="aPriority"]').val(1);
			$('#text_android_priority').html("Important emails realtime chat SMS");
			break;
			
		case 2:
			$('input[name="aPriority"]').val(2);
			$('#text_android_priority').html("incoming/ongoing calls turn-by-turn directions emergency alert");
			break;
			
		case -1:
			$('input[name="aPriority"]').val(-1);
			$('#text_android_priority').html("software updates");
			break;
			
		case -2:
			$('input[name="aPriority"]').val(-2);
			$('#text_android_priority').html("expired events, suggestions weather, location info");
			break;
	};
});

// Event change of component 'paper-slider' of expiration time.
$('#expiration_time').on('immediate-value-change', function() {
	switch( $(this)[0].immediateValue ) {
		case 0:
			$('input[name="aGcmTtl"]').val(0);
			$('#text_expiration_time').html("0");
			break;
			
		case 1:
			$('input[name="aGcmTtl"]').val(900);
			$('#text_expiration_time').html("15 minutos");
			break;
			
		case 2:
			$('input[name="aGcmTtl"]').val(1800);
			$('#text_expiration_time').html("30 minutos");
			break;
			
		case 3:
			$('input[name="aGcmTtl"]').val(3600);
			$('#text_expiration_time').html("1 hora");
			break;
			
		case 4:
			$('input[name="aGcmTtl"]').val(7200);
			$('#text_expiration_time').html("2 horas");
			break;
			
		case 5:
			$('input[name="aGcmTtl"]').val(14400);
			$('#text_expiration_time').html("4 horas");
			break;
			
		case 6:
			$('input[name="aGcmTtl"]').val(21600);
			$('#text_expiration_time').html("6 horas");
			break;
			
		case 7:
			$('input[name="aGcmTtl"]').val(43200);
			$('#text_expiration_time').html("12 horas");
			break;
			
		case 8:
			$('input[name="aGcmTtl"]').val(86400);
			$('#text_expiration_time').html("1 día");
			break;
			
		case 9:
			$('input[name="aGcmTtl"]').val(172800);
			$('#text_expiration_time').html("2 días");
			break;
			
		case 10:
			$('input[name="aGcmTtl"]').val(259200);
			$('#text_expiration_time').html("3 días");
			break;
			
		case 11:
			$('input[name="aGcmTtl"]').val(604800);
			$('#text_expiration_time').html("1 semana");
			break;
	};
});

function localize(text) {       
    return localizer.get(text);
};

function getValueExpirationTime(expirationTime) {
	switch( expirationTime ) {
		case 0:
			return 0;
			
		case 900:
			return 1;
			
		case 1800:
			return 2;
			
		case 3600:
			return 3;
			
		case 7200:
			return 4;
			
		case 14400:
			return 5;
			
		case 21600:
			return 6;
			
		case 43200:
			return 7;
			
		case 86400:
			return 8;
			
		case 172800:
			return 9;
			
		case 259200:
			return 10;
			
		case 604800:
			return 11;
	};
	
	return -1;
}

function getTextExpirationTime(expirationTime) {
	switch(expirationTime) {
		case 0:
			$('#text_expiration_time').html("0");
			break;
			
		case 900:
			$('#text_expiration_time').html("15 minutos");
			break;
			
		case 1800:
			$('#text_expiration_time').html("30 minutos");
			break;
			
		case 3600:
			$('#text_expiration_time').html("1 hora");
			break;
			
		case 7200:
			$('#text_expiration_time').html("2 horas");
			break;
			
		case 14400:
			$('#text_expiration_time').html("4 horas");
			break;
			
		case 21600:
			$('#text_expiration_time').html("6 horas");
			break;
			
		case 43200:
			$('#text_expiration_time').html("12 horas");
			break;
			
		case 86400:
			$('#text_expiration_time').html("1 día");
			break;
			
		case 172800:
			$('#text_expiration_time').html("2 días");
			break;
			
		case 259200:
			$('#text_expiration_time').html("3 días");
			break;
			
		case 604800:
			$('#text_expiration_time').html("1 semana");
			break;
	};
}

function getTextPriority(priority) {
	switch( priority ) {
		case 0:
			$('#text_android_priority').html("<b>everything else</b> (and all legacy notification)");
			break;
			
		case 1:
			$('#text_android_priority').html("Important emails realtime chat SMS");
			break;
			
		case 2:
			$('#text_android_priority').html("incoming/ongoing calls turn-by-turn directions emergency alert");
			break;
			
		case -1:
			$('#text_android_priority').html("software updates");
			break;
			
		case -2:
			$('#text_android_priority').html("expired events, suggestions weather, location info");
			break;
	};
}

function initAutocomplete() {
    var map = new google.maps.Map($('#map')[0], {
        center: {lat: 0, lng: 0},
        zoom: 2
    });

    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    var markers = [];
    var circles = [];
    
    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });
    
    // Añadimos la geoposición si tenemos los valores.
    if($('input[name="name"]').val() && $('input[name="lat"]').val() &&
	$('input[name="lng"]').val() && $('input[name="radius"]').val()) {    	
    		$('#map-radius').val($('input[name="radius"]').val());
    		$('#current_range').html($('#map-radius').val());
    		
    		// Clean markers and circles.
        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        markers = [];

        circles.forEach(function(circle) {
            circle.setMap(null);
        });
        circles = [];
        
        var icon = {
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        markers.push(new google.maps.Marker({
            map: map,
            icon: icon,
            title: $('input[name="name"]').val(),
            position: {lat: Number($('input[name="lat"]').val()), lng: Number($('input[name="lng"]').val())},
            draggable: false
        }));
        
        bounds.extend(markers[0].getPosition());
        
        var circle = new google.maps.Circle({
            strokeColor: '#785123',
            strokeWeight: 0.5,
            fillOpacity: 0.1,
            editable: true,
            zIndex: 1,
            center: {lat: Number($('input[name="lat"]').val()), lng: Number($('input[name="lng"]').val())},
            radius: parseInt($('input[name="radius"]').val())
        });
        
        var contentString = '<div id="content">'+
        '<div id="siteNotice">'+
        '</div>'+
        '<div id="bodyContent">'+
        '<p>' + $('input[name="name"]').val() + '</p>'+
        '</div>'+
        '</div>';

        var iwindow = new google.maps.InfoWindow({
            content: contentString
        });

        circle.setMap(map);

        markers.forEach(function(marker) {
            circle.bindTo('center', marker, 'position');
            iwindow.open(map, marker);
        });                        

        circles.push(circle); 

        // Event radius_changed circle.
        circles.forEach(function(circle) {
            circle.addListener('radius_changed', function() {
                var radius = this.getRadius();

                if(radius > 1000 || radius < 50) {
                    alert('El radio no puede superar los 1000 metros ni ser inferior a 50 metros.');

                    if( $('#map-radius').val() == '' ) {
                        $('#map-radius').val(1000);
                    }

                    this.setRadius(parseInt($('#map-radius').val()));                        
                }
                else {
                    $('#map-radius').val(Math.round(radius));
                }
                
                $('input[name="radius"]').val(parseInt($('#map-radius').val()));
                $('#current_range').html($('#map-radius').val());
            });
        });
                
        map.fitBounds(bounds);
        
        zoomChangeBoundsListener = google.maps.event.addListenerOnce(map, 'bounds_changed', function(event) {
            if(this.getZoom()) {
                this.setZoom(12);
            }
        });
        
        setTimeout(function(){google.maps.event.removeListener(zoomChangeBoundsListener)}, 500);
    }
    
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if(places.length == 0) {
            return;
        }

        // Clean markers and circles.
        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        markers = [];

        circles.forEach(function(circle) {
            circle.setMap(null);
        });
        circles = [];
                
        places.forEach(function(place) {
            if(!place.geometry) {
                console.log('Returned place contains no geometry');
                return;
            }

            var icon = {
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location,
                draggable: false
            }));
            
            var circle = new google.maps.Circle({
                strokeColor: '#785123',
                strokeWeight: 0.5,
                fillOpacity: 0.1,
                editable: true,
                zIndex: 1,
                center: {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()},
                radius: parseInt( $('#map-radius').val() )
            });
            
            var contentString = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<div id="bodyContent">'+
            '<p>' + place.formatted_address + '</p>'+
            '</div>'+
            '</div>';

            var iwindow = new google.maps.InfoWindow({
                content: contentString
            });

            circle.setMap(map);

            markers.forEach(function(marker) {
                circle.bindTo('center', marker, 'position');
                iwindow.open(map, marker);
            });                        

            circles.push(circle); 
            
            // Almacenamos los valores que vamos a mandar.
            $('input[name="name"]').val(place.formatted_address);
            $('input[name="lat"]').val(place.geometry.location.lat());
            $('input[name="lng"]').val(place.geometry.location.lng());
            $('input[name="radius"]').val(parseInt($('#map-radius').val()));

            // Event radius_changed circle.
            circles.forEach(function(circle) {
                circle.addListener('radius_changed', function() {
                    var radius = this.getRadius();

                    if(radius > 1000 || radius < 50) {
                        alert('El radio no puede superar los 1000 metros ni ser inferior a 50 metros.');

                        if( $('#map-radius').val() == '' ) {
                            $('#map-radius').val(1000);
                        }

                        this.setRadius(parseInt($('#map-radius').val()));                        
                    }
                    else {
                        $('#map-radius').val(Math.round(radius));
                    }
                    
                    $('input[name="radius"]').val(parseInt($('#map-radius').val()));
                    $('#current_range').html($('#map-radius').val());
                });
            }); 
        
            if(place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        
        map.fitBounds(bounds);
    });

    map.addListener('click', function(event) {
        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        markers = [];

        circles.forEach(function(circle) {
            circle.setMap(null);
        });
        circles = [];
        
        var icon = {
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        markers.push(new google.maps.Marker({
            map: map,
            icon: icon,
            position: event.latLng,
            draggable: true
        }));

        var circle = new google.maps.Circle({
            strokeColor: '#785123',
            strokeWeight: 0.5,
            fillOpacity: 0.1,
            editable: true,
            zIndex: 1,
            center: {lat: event.latLng.lat(), lng: event.latLng.lng()},
            radius: parseInt($('#map-radius').val())
        });

        circle.setMap(map);                    

        markers.forEach(function(marker) {
            circle.bindTo('center', marker, 'position');
        });

        circles.push(circle);

        // Event radius_changed circle.
        circles.forEach(function(circle) {
            circle.addListener('radius_changed', function() {
                var radius = this.getRadius();

                if(radius > 1000 || radius < 50) {
                    alert('El radio no puede superar los 1000 metros ni ser inferior a 50 metros.');

                    if( $('#map-radius').val() == '' ) {
                        $('#map-radius').val(1000);                        
                    }

                    this.setRadius(parseInt($('#map-radius').val()));
                }
                else {
                    $('#map-radius').val(Math.round(radius));
                    $('#current_range').html($('#map-radius').val());
                }
                
                $('input[name="radius"]').val(parseInt($('#map-radius').val()));
                $('#current_range').html($('#map-radius').val());
            });
        });
        
        // Almacenamos los valores que vamos a mandar.
        $('input[name="name"]').val(getName(event.latLng.lng(), event.latLng.lat()));
        $('input[name="lat"]').val(event.latLng.lat());
        $('input[name="lng"]').val(event.latLng.lng());
        $('input[name="radius"]').val(parseInt($('#map-radius').val()));
    });                               

    $('#map-radius').on('change', function() {
        var _this = this;
        
        if(circles.length > 0) {
	        	if($(_this).val() > 1000 || $(_this).val() < 50) {
	            alert('El radio no puede superar los 1000 metros ni ser inferior a 50 metros.');
	            $(_this).val(1000);
	            $('#current_range').html('1000');
	        }
	        else {
	        		circles.forEach(function(circle) {
	                circle.setRadius(parseInt($(_this).val()));
	                $('#current_range').html($(_this).val());
	            });                        
	        }
        }
        else {
        		$('#current_range').html($(_this).val());
        }
    });
}

function getName(lng, lat) {
	var name = '';
	
	$.ajax({
		url: "http://maps.googleapis.com/maps/api/geocode/json?latlng=" +
		lat + "," + lng + "&sensor=false",
		async: false,
		success: function(response) {
    	  		name = response.results[0].formatted_address;
		},
		error: function(error) {
			name = "No name";
		}
	});
	
	return name;
}