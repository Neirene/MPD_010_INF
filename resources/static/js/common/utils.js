var apiUrl = ""; //Empty to point to the same server
var currentBrowser = "";  //Empty variable to store user's current Browser

var Utils = function(){};
var utils = new Utils();

Utils.prototype.ajax = function(endpoint, dat, succ, err ) {
	$.ajax({
		method: 'POST',
		url: apiUrl+endpoint,
		data: dat,
		async: true,
		success: function(response){
			succ(response);
		},
		error: function(response){
			if(typeof err === "function")
				err(response);
			else {
				console.log('Error', apiUrl+endpoint, response);
			}
		}
	});
}

Utils.prototype.post = function(endpoint, dat, succ, err ) {
	$.ajax({
		method: 'POST',
		dataType:'json',
		contentType : 'application/json',
		mimeType : 'application/json',
		url: apiUrl+endpoint,
		data: dat,
		async: true,
		processData:false,
		success: function(response){
			succ(response);
		},
		error: function(response){
			if(typeof err === "function")
				err(response);
			else {
				console.log('Error', apiUrl+endpoint, response);
			}
		}
	});
}


Utils.prototype.apiGet = function(endpoint, dat, succ, err ) {
	var oldApiUrl = utils.getApiUrl();
	$.ajax({
		method: 'GET',
		url: oldApiUrl+endpoint,
		data: dat,
		async: true,
		success: function(response){
			succ(response);
		},
		error: function(response){
			if(typeof err === "function")
				err(response);
			else {
				console.log('Error', oldApiUrl+endpoint, response);
			}
		}
	});
}

Utils.prototype.apiPost = function(endpoint, dat, succ, err ) {
	var oldApiUrl = utils.getApiUrl();
	$.ajax({
		method: 'POST',
		url: oldApiUrl+endpoint,
		data: dat,
		async: true,
		success: function(response){
			succ(response);
		},
		error: function(response){
			if(typeof err === "function")
				err(response);
			else {
				console.log('Error', oldApiUrl+endpoint, response);
			}
		}
	});
}

Utils.prototype.get = function(endpoint, dat, succ, err ) {
	$.ajax({
		method: 'GET',
		url: apiUrl+endpoint,
		data: dat,
		async: true,
		success: function(response){ 
			succ(response);
		},
		error: function(response){
			if(typeof err === "function")
				err(response);
			else {
				console.log('Error', apiUrl+endpoint, response);
			}
		}
	});
}

Utils.prototype.delete = function(endpoint, dat, succ, err ) {
	$.ajax({
		method: 'DELETE',
		url: apiUrl+endpoint,
		data: dat,
		async: true,
		success: function(response){
			succ(response);
		},
		error: function(response){
			if(typeof err === "function")
				err(response);
			else {
				console.log('Error', apiUrl+endpoint, response);
			}
		}
	});
}

Utils.prototype.fileAjax = function(url, dat, succ, err ) {
	$.ajax({
		url: url,
		data: dat,
		processData: false,
		contentType: false,
		type: 'POST',
		success: function(response){
			succ(response);
		},
		error: function(response){
			if(typeof err === "function")
				err(response);
			else {
				alert("Error");
				console.log(response);
			}
		}

	});
}

Utils.prototype.getMonthName = function(month) {

	$month = "";
	switch (month) {
	case "1":
	case "01": $month = "Enero"; break;
	case "2":
	case "02": $month = "Febrero"; break;
	case "3":
	case "03": $month = "Marzo"; break;
	case "4":
	case "04": $month = "Abril"; break;
	case "5":
	case "05": $month = "Mayo"; break;
	case "6":
	case "06": $month = "Junio"; break;
	case "7":
	case "07": $month = "Julio"; break;
	case "8":
	case "08": $month = "Agosto"; break;
	case "9":
	case "09": $month = "Septiembre"; break;
	case "10": $month = "Octubre"; break;
	case "11": $month = "Noviembre"; break;
	case "12": $month = "Diciembre"; break;
	}
	return $month;
}

Utils.prototype.formatDecimal = function(num, decimals) {
	decimals = decimals || 2;

	var pattern = /^0+$/;
	var res = String(num).split(".");
	if(!res[1] || pattern.test(res[1])) 
		return num;

	else 
		return num.toFixed(decimals).toLocaleString();
}




Utils.prototype.roundTwoDec = function(number) {
	return Math.round(number*100)/100;
}


Utils.prototype.getVisibleRadius = function(map) {
	var bounds = map.getBounds();

	var center = bounds.getCenter();
	var ne = bounds.getNorthEast();

	// r = radius of the earth in statute miles
	var r = 3963.0;  

	// Convert lat or lng from decimal degrees into radians (divide by 57.2958)
	var lat1 = center.lat() / 57.2958; 
	var lon1 = center.lng() / 57.2958;
	var lat2 = ne.lat() / 57.2958;
	var lon2 = ne.lng() / 57.2958;

	// distance = circle radius from center to Northeast corner of bounds
	var dis = r * Math.acos(Math.sin(lat1) * Math.sin(lat2) + 
			Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1));

	return dis;
}


Utils.prototype.seedRandom = function(seed) {
	var x = Math.sin(seed++) * 10000;
	return x - Math.floor(x);
}

Utils.prototype.getRandomNumber = function(min, max, seed) {

       min = min || 0;
        max = max || 1;
        var rand;
        if (typeof seed === "number") {
            seed = (seed * 9301 + 49297) % 233280;
            var rnd = seed / 233280;
            var disp = Math.abs(Math.sin(seed));
            rnd = (rnd + disp) - Math.floor((rnd + disp));
            rand = min + rnd * (max - min + 1);
        } else {
            rand = Math.floor(Math.random() * (max - min + 1)) + min;
        }
        return rand;
    },


Utils.prototype.getInputFileName = function(path) {

	var split = path.split("\\");

	if(split.length < 1) {
		split = path.split("/");
	}
	if(split.length > 1)
		return split[split.length-1];

	return false;
}

Utils.prototype.floatingSuccess = function(message, delay) {
	this.floatingMessage(message, "2FD566", delay)
}

Utils.prototype.floatingError = function(message, delay) {
	this.floatingMessage(message, "DC544B", delay)
}


Utils.prototype.floatingMessage = function(message, color, delay) {
	if(typeof this.zindex == "undefined")
		this.zindex = 1000;
	else this.zindex++;
	
	delay = delay || 2500;
	
	let div = document.createElement('div');
	div.innerHTML = message;
	div.className = "animated bounceInRight";
	div.style.cssText = 'z-index:'+this.zindex+';position:fixed;right:0px; top:50px;padding:20px; color:white; background-color:#'+color+';';
	$('body').prepend(div);

	setTimeout(function(){
		$(div).addClass('flipOutX');
		setTimeout(function() {
			$(div).remove();
		},1000)
	},delay);
}

Utils.prototype.writeCSV = function(file_name, data)  {
	
	var encodedUri = "data:text/csv;charset=utf-8,"+encodeURI(data);
	var link = document.createElement("a");
	link.setAttribute("href", encodedUri);
	link.setAttribute("download", file_name+".csv");
	document.body.appendChild(link); // Required for FF

	link.click();
}


Utils.prototype.generateCSV = function(file_name, data) {

	var csvContent = "data:text/csv;charset=utf-8,";
	data.forEach(function(infoArray, index){
		dataString = infoArray.join(";");
		csvContent += index < data.length ? dataString+ "\n" : dataString;
	}); 

	var encodedUri = encodeURI(csvContent);
	var link = document.createElement("a");
	link.setAttribute("href", encodedUri);
	link.setAttribute("download", file_name+".csv");
	document.body.appendChild(link); // Required for FF

	link.click();
}



Utils.prototype.importCSV = function(file, callback) {
	var reader = new FileReader();
	reader.onload = function(e) {
		var data = e.target.result.split("\n");
		callback(data);
	}
	reader.readAsText(file);
}


Utils.prototype.formatToLetter = function(num) {	
	var si = [
		{ value: 1E18, symbol: "E" },
		{ value: 1E15, symbol: "P" },
		{ value: 1E12, symbol: "T" },
		{ value: 1E9,  symbol: "G" },
		{ value: 1E6,  symbol: "M" },
		{ value: 1E3,  symbol: "k" }
		], rx = /\.0+$|(\.[0-9]*[1-9])0+$/, i;
	for (i = 0; i < si.length; i++) {
		if (num >= si[i].value) {
			return (num / si[i].value).toFixed(1).replace(rx, "$1") + si[i].symbol;
		}
	}
	return num.toFixed(1).replace(rx, "$1");	
}

Utils.prototype.lockScreen  = function() {

	$('body').prepend('<div class="scr-locker" style="height:100%; width:100%; position:fixed; z-index:999999; background-color:rgba(255,255,255,0.5);'+
	'display:flex; justify-content:center; align-items:center; "><paper-spinner active></paper-spinner></div>')
}

Utils.prototype.unlockScreen  = function() {
	$('.scr-locker').remove();
}

Utils.prototype.getFormAsObject = function(form) {
	
	var fd = $('#'+form).serializeArray();
	
	var result = {};
	fd.forEach((elem) => {
		result[elem.name] = elem.value;
	})
	
	
	$('#'+form+' infinia-select, #'+form+' paper-input, #'+form+" paper-typeahead").each(function(index, elem){
		if($(elem).attr('name'))
			result[$(elem).attr('name')] =  $(elem).val();
	})
	$('#'+form+' date-picker').each(function(index, elem){
		if($(elem).attr('name'))
			result[$(elem).attr('name')] = $(elem)[0].getValue();
	})
	
	$('#'+form+' paper-checkbox').each(function(index, elem){
		if($(elem).attr('name'))
			result[$(elem).attr('name')] = $(elem).prop('checked') ? true:false;

	})
	return result;
}

Utils.prototype.loadFormData = function(data, form) {
 
	let f = "";
	if(form)
		f = '#'+form+" ";
	
	Object.keys(data).forEach(function(key){
		if($(f+'input[name="'+key+'"]').prop('type') != "radio")
			$(f+'input[name="'+key+'"]').val(data[key]);
		$(f+'select[name="'+key+'"]').val(data[key]);
		$(f+'textarea[name="'+key+'"]').val(data[key]);
		$(f+'paper-input[name="'+key+'"]').val(data[key]);
		$(f+'paper-typeahead[name="'+key+'"]').val(data[key]);
		
		if($(f+'paper-checkbox[name="'+key+'"]').length > 0 && data[key])
			$(f+'paper-checkbox[name="'+key+'"]').prop('checked',true);
	
		let rads = $('input:radio[name='+key+']');
		if(rads.length > 0)
			rads.filter('[value='+data[key]+']').prop('checked', true);
		
		var $inf_select = document.querySelector(f+'infinia-select[name="'+key+'"]');
		if($inf_select) {
			$inf_select.setValue(data[key]);
		}

		var $date_picker = $(f+'date-picker[name="'+key+'"]');
		if($date_picker[0]) {
			$date_picker[0].setValue(data[key]);
		}
		
		var $fileLoader = $(f+'file-loader[name="'+key+'"]');
		if($fileLoader[0] && data[key] && data[key].length > 0) {
			$fileLoader[0].setFiles(data[key]);
		}
	});
}

Utils.prototype.validateOrderLine = function(formId) {
	
	(document.querySelector('input[name="budget"]').classList).remove('required');
	(document.querySelector('input[name="impressions"]').classList).remove('required');
	(document.querySelector('input[name="bidPrice"]').classList).remove('required');
	
	var selectedDeals = $("#inventory-deals")[0].getData();
	if (selectedDeals.length == 0 && document.querySelector('infinia-select[name="goalType"]').value!="openFormat"){
		// Si no hay deals -> Tiene que haber bidPrice y budget introducido
		var okBudget = document.querySelector('input[name="budget"]').value != "" && Number(document.querySelector('input[name="budget"]').value) > 0;
		var okBidPrice = document.querySelector('input[name="bidPrice"]').value != "" && Number(document.querySelector('input[name="bidPrice"]').value) > 0;
		
		if (!okBudget || !okBidPrice){
			(document.querySelector('input[name="budget"]').classList).add('required');
			(document.querySelector('input[name="bidPrice"]').classList).add('required');
		}
	}
	else {
		// Si hay deals se necesitan las impressiones para rellenar el budget
		var okImpressions = document.querySelector('input[name="impressions"]').value != "" && Number(document.querySelector('input[name="impressions"]').value) > 0;
		
		if (!okImpressions){
			(document.querySelector('input[name="impressions"]').classList).add('required');
		}
	}
	return utils.validateRequired(formId);
}

Utils.prototype.validateRequired = function(formId) {
	var valid = true;
	$('#'+formId+' .required').each(function(index, elem) {
		(elem.classList).remove('has-error')
		if (elem.localName === 'date-picker'){
			if (!elem.isValid()){
				$(elem).addClass('has-error');
				valid = false;
			}
		}
		
		else if (elem.localName === 'file-loader'){
			if (!elem.hasFiles()){
				$(elem).addClass('has-error');
				valid = false;
			}
		}
		
		else {
			var error = false;
			if(typeof $(elem).val() == undefined || $(elem).val() === ""){
				error = true;
			}
			else if (elem.type === 'number'){
				if ($(elem).attr('max') != undefined || $(elem).attr('min') != undefined) {
					if (($(elem).attr('max') != undefined && Number($(elem).val()) > $(elem).attr('max')) || ($(elem).attr('min') != undefined && Number($(elem).val()) < $(elem).attr('min'))) {
						error = true;
					}
				}
				else if (Number($(elem).val()) === 0) {
					error = true;
				}
			}
			
			if (error){
				$(elem).addClass('has-error');
				$(elem).focus();
				valid = false;
			}
		}
	})

	if(!valid) {
		utils.floatingError("Faltan campos obligatorios");
	}
	return valid;
}


Utils.prototype.modal = function(title, content,  options) {
	$("#modal")[0].refit()
	$("#modal").removeClass('hide');
	$("#modalContents").html(content)
	$("#modalTitle").html(title)
	$("#modal")[0].toggle()

}

Utils.prototype.closeModal = function() {
	$("#modal")[0].close()
}

Utils.prototype.pagination = function(current, total){
	
	if(total == 0) return [];
	var list = [];
	var pageLimit = 3;
	var upperLimit, lowerLimit;
	var currentPage = lowerLimit = upperLimit = Math.min(current, total);

	for (var b = 1; b < pageLimit && b < total;) {
	    if (lowerLimit > 1 ) {
	        lowerLimit--; b++; 
	    }
	    if (b < pageLimit && upperLimit < total) {
	        upperLimit++; b++; 
	    }
	}

	for (var i = lowerLimit; i <= upperLimit; i++) {
	    if (i == currentPage){
	    	list.push(i);
	    }
	    else{
	    	list.push(i);
	    }
	}
	if(list.indexOf(1) == -1){
		if(list[0] > 2) list.unshift("...");
		list.unshift(1);
	}
	if(list.indexOf(total) == -1){
		if(list[list.length-1] < total-1) list.push("...");
		list.push(total);
	}
	return list;
}


Utils.prototype.getClickedElement = function(e) {
	var path = this.getPath(e.target);
	return path[0];
}


Utils.prototype.getPath = function(currentElem){
	    var path = [];
	    
	    while (currentElem) {
	      path.push(currentElem);
	      currentElem = currentElem.parentElement;
	    }
	    if (path.indexOf(window) === -1 && path.indexOf(document) === -1)
	      path.push(document);
	    if (path.indexOf(window) === -1)
	      path.push(window);
	    return path;
}

Utils.prototype.getCountryList = function(succ, err){
	$.ajax({
        method: 'GET',
        url: 'https://restcountries.eu/rest/v2/all?fields=numericCode;translations',
        async: true,
        success: function(response){
           succ(response);
        },
        error: function(response){
        	if(typeof err === "function")
        		err(response);
        	else {
        		console.log(response);
        	}
        }
    });
}

Utils.prototype.getApiUrl = function() {
	return JSON.parse(localStorage.getItem('accountData')).userHeader.apiUrl;
}

Utils.prototype.getMainUrl = function() {
	return JSON.parse(localStorage.getItem('accountData')).initPage;
}

Utils.prototype.getUserCountry = function() {
	return JSON.parse(localStorage.getItem('accountData')).userHeader.country;
}

Utils.prototype.getUserId = function() {
	return JSON.parse(localStorage.getItem('accountData')).userHeader.id;
}

Utils.prototype.getNameEntity = function() {
	return JSON.parse(localStorage.getItem('accountData')).userHeader.roleEntity.nameEntity;
}

Utils.prototype.getNameRole = function() {
	return JSON.parse(localStorage.getItem('accountData')).userHeader.roleEntity.role.role;
}

Utils.prototype.initStatusSelect = function() {
	if(typeof 	$('infinia-select[name="status"]')[0] !== "undefined"){
		$('infinia-select[name="status"]')[0].options = [
			{id:'0', value:localizer.get('deactivated')},
			{id:'1', value:localizer.get('active')}
		];
	}
}

Utils.prototype.initIABSelect = function() {
	if(typeof 	$('infinia-select[name="iab"]')[0] !== "undefined"){
		$('infinia-select[name="iab"]')[0].options = this.getIABData();
	}
}

Utils.prototype.getIABData = function() {
	return [
		{id:31, value:"Adult"},
		{id:1, value:"Air travel"},
		{id:30, value:"Alcohol"},
		{id:2, value:"Autos"},
		{id:3, value:"Business services"},
		{id:5, value:"Clothing & Accessories"},
		{id:6, value:"Computer (Hardware & Software)"},
		{id:28, value:"Consumer Goods"},
		{id:7, value:"Credit Cards"},
		{id:8, value:"Dating"},
		{id:11, value:"Education"},
		{id:4, value:"Electronics"},
		{id:9, value:"Employment"},
		{id:12, value:"Entertainment"},
		{id:13, value:"Food & Beverages"},
		{id:27, value:"Gambling"},
		{id:29, value:"Government"},
		{id:16, value:"Home & Garden"},
		{id:24, value:"Hotels"},
		{id:17, value:"Insurance"},
		{id:18, value:"Internet Services"},
		{id:25, value:"Media"},
		{id:26, value:"Non-Profit"},
		{id:19, value:"Personal Care"},
		{id:20, value:"Personal Finance"},
		{id:14, value:"Pets"},
		{id:10, value:"Pharmaceuticals (Rx & OTC)"},
		{id:21, value:"Real Estate"},
		{id:33, value:"Religion and Spirituality"},
		{id:22, value:"Sporting Goods"},
		{id:23, value:"Telecommunications"},
		{id:32, value:"Tobacco"},
		{id:15, value:"Toys"},
		{id:34, value:"Weight Loss"}
	]
}


Utils.prototype.removeFromArray = function(array, elem) {
	var index = array.indexOf(elem);
	if (index > -1) {
	    array.splice(index, 1);
	}
}

Utils.prototype.bytesToSize = function(bytes) {
	   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	   if (bytes == 0) return '0 Byte';
	   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
	   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
	};
	
	
Utils.prototype.validURL = function(str) {
	return  /^(https?|ftp):\/\//i.test(str);
}


Utils.prototype.publicatePushwooshCampaign = function(id){
	utils.lockScreen();
	utils.get("/api/pushwoosh_campaigns/" + id + "/sendCampaign", {}, 
	(response) => {
		utils.unlockScreen();
		alert('Campaña en proceso de publicación. El proceso tardará unos minutos');
		window.location.href= "/pushwoosh_campaigns";
	}, 
	(error) => {
		utils.unlockScreen();
		console.log('Error publicating order line', id, error);
	});
}


Utils.prototype.stopPublishPushwooshCampaign = function(id) {
	utils.lockScreen();
	utils.get("/api/pushwoosh_campaigns/"+id+"/stopPublishingCampaign", {},
		(response) => {
			utils.unlockScreen();
			alert('Se ha parado la publicación de la campaña.');
		},
		(error) => {
			utils.unlockScreen();
			console.log("Error al volver a publicar la campaña", id, error);
		}
	);
}


Utils.prototype.publicateCampaign = function(id){
	utils.lockScreen();
	utils.get("/api/campaigns/dsp/upload/" + id, {}, 
	(response) => {
		utils.unlockScreen();
		alert('Campaña en proceso de publicación. El proceso tardará unos minutos')
	
	}, 
	(error) => {
		utils.unlockScreen();
		console.log('Error publicating order line', id, error);
	});
}

Utils.prototype.publicateAdmiraCampaign = function(id){
	utils.lockScreen();
	utils.get("/api/campaigns_ds/admira/upload/" + id, {}, 
	(response) => {
		utils.unlockScreen();
		alert('Campaña en proceso de publicación. El proceso tardará unos minutos')
	
	}, 
	(error) => {
		utils.unlockScreen();
		console.log('Error publicating order line', id, error);
	});
}

Utils.prototype.validateCluster = function(id){

	if (confirm("¿Estás seguro de que deseas validar el Cluster?")){
		utils.lockScreen();
		utils.get('/api/clusters/' + id + '/validate', {}, 
		(response) => {
			utils.unlockScreen();
			if(response){
				utils.floatingSuccess("Cluster validado correctamente");
			}else{
				alert('Este cluster ya está validado')
			}
				
			
		}, 
		(error) => {
			utils.unlockScreen();
			alert('Este cluster ya está validado')

			console.log('Error deleting cluster', this.elemId, error);
		});	  
		
	}
}

Utils.prototype.checkValidateCluster = function(){

	if(this.getNameRole() != "ROLE_VALIDATOR"){
		$(".validate-cluster").remove();
	}
}

Utils.prototype.checkCampaign = function(id,publicate){
	utils.lockScreen();
	utils.get("/api/campaigns/dsp/check/" + id, {}, 
	(response) => {
		
		var errors = "<br><ul>";
		var hasErrors = false;
		 for(var i = 0; i < response.length; i++){
			 errors+="<li>";
			 if(response[i].value){
				 hasErrors  = true;
				 errors+=localizer.get("campaignValidation."+response[i].field)+"<br>";
				 
				 for(var j = 0; j < response[i].entitiesAffected.length; j++){
					 errors+="- "+response[i].entitiesAffected[j]+"<br>";

				 }
			 }
			 errors+="</li>";

		   }
		 errors+="</ul>";

		 if(!hasErrors){
			 if(publicate)
				 this.publicateCampaign(id);
			 else
				utils.modal("Campaña valida", "Esta campaña tiene los datos necesarios para subirse al DSP", {disableCloseButton:false});

		 }else{
			 var headStatus = "";
			 var headBody="";
			 headStatus = "Campaña con errores<br>"
			 headBody = "La campaña tiene los siguientes errores: <br>"+errors;
			 utils.modal(headStatus, headBody +"<br><b>Hasta que no se corrijan estos errores la campaña no se puede publicar en el DSP</b>", {disableCloseButton:false});
		 }
		 
		 
		utils.unlockScreen();
	
	}, 
	(error) => {
		utils.unlockScreen();
		console.log('Error checking campaign status', id, error);
	});
}

Utils.prototype.publicateNotificationPushwoosh = function(id, idPushwooshCampaign){
	utils.lockScreen();
	
	utils.get("/api/pushwoosh_notifications/" + id + "/sendNotification", {}, 
	(response) => {
		utils.unlockScreen();
		alert('Notificación en proceso de publicación. El proceso tardará unos minutos');
		window.location.href = "/pushwoosh_campaigns/" + idPushwooshCampaign + "/pushwoosh_notifications";
	}, 
	(error) => {
		utils.unlockScreen();
		console.log('Error publicando notificación', id, error);
	});
}

Utils.prototype.stopPublishPushwooshNotification = function(id, idPushwooshCampaign) {
	utils.lockScreen();
	utils.get("/api/pushwoosh_notifications/"+id+"/stop", {},
		(response) => {
			utils.unlockScreen();
			alert('Se ha parado la publicación de la notificación.');
			window.location.href = "/pushwoosh_campaigns/" + idPushwooshCampaign + "/pushwoosh_notifications";
		},
		(error) => {
			utils.unlockScreen();
			console.log("Error al volver a publicar la campaña", id, error);
		}
	);
}


Utils.prototype.saveAs = function(uri, filename) {
    var link = document.createElement('a');
    if (typeof link.download === 'string') {
        document.body.appendChild(link); // Firefox requires the link to be in the body
        link.download = filename;
        link.href = uri;
        link.click();
        document.body.removeChild(link); // remove the link when done
    } else {
        location.replace(uri);
    }
}

Utils.prototype.sortAsc = function(a, b) {
	return a.value.toLowerCase().trim().localeCompare(b.value.toLowerCase().trim());  
}

//Format to D/M/Y H:S
Utils.prototype.formatDate = function(date, hideHour) {
	let d = this.formatToTwoDigits(date.getDate())+"/"+this.formatToTwoDigits(date.getMonth()+1)+
				"/"+date.getFullYear();
	
	if(!hideHour)
		d+=" "+this.formatToTwoDigits(date.getHours())+":"+this.formatToTwoDigits(date.getMinutes());
	
	return d;
}



Utils.prototype.formatToTwoDigits = function(n) {
	return ("0" + n).slice(-2);
}

Utils.prototype.loadTimeSelectors = function(selectorId) {
	var timing = [{id:"day", value:localizer.get('day')}, {id:"week", value:localizer.get('week')},
				  {id:"month", value:localizer.get('month')},{id:"year", value:localizer.get('year')}];
	$('.time-selector').each(function(index, elem) {
		elem.options = timing;
	});
}

Utils.prototype.loadHourSelectors = function(selectorId) {
	var timing = [];
	
	for(i=0; i<24; i++) {
		timing.push({id:i, value:this.formatToTwoDigits(i)+":00"});
		// timing.push({id:i+":30", value:this.formatToTwoDigits(i)+":30"});
	}

	$('.hour-selector').each(function(index, elem) {
		elem.options = timing;
	});
}


Utils.prototype.getVisibleRadius = function(map) {
    var bounds = map.getBounds();

    var center = bounds.getCenter();
    var ne = bounds.getNorthEast();

    // r = radius of the earth in statute miles
    var r = 3963.0;  

    // Convert lat or lng from decimal degrees into radians (divide by 57.2958)
    var lat1 = center.lat() / 57.2958; 
    var lon1 = center.lng() / 57.2958;
    var lat2 = ne.lat() / 57.2958;
    var lon2 = ne.lng() / 57.2958;

    // distance = circle radius from center to Northeast corner of bounds
    var dis = r * Math.acos(Math.sin(lat1) * Math.sin(lat2) + 
      Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1));

    return dis;
}

Utils.prototype.getUserCountryCoordinates = function(country){
	let coords = {
		ES:{lat:40.4167019, lng:-3.7037783000000672},
		MX:{lat:19.432666, lng:-99.1324396},
		CO:{lat:4.707690, lng:-74.077901},
		CL:{lat:-33.4488897, lng:-70.6692655},
		PE:{lat:-12.0264987,lng:-77.2679864},
		AR:{lat:-34.6157437,lng:-58.5733857},
		CR:{lat:9.9356124, lng:-84.1483648}
	}
	
	if(this.getUserCountry())
		return coords[utils.getUserCountry()];
	else
		return coords["ES"];
}

Utils.prototype.getSortFunction = function(name){
	if(name == "income_level") return this.sortIncome;
	if(name == "age") return this.sortAge;
	if(name == "gender") return this.sortGender;
}

Utils.prototype.sortIncome = function(a, b){
	let income=["income_A", "income_B", "income_C", "income_D", "income_E"];
	return income.indexOf(b) - income.indexOf(a);	
}

Utils.prototype.sortAge = function(a, b){
	let age=["<12", "12-17", "18-25", "26-40", "41-55" , ">55"];
	return age.indexOf(a) - age.indexOf(b);	
}

Utils.prototype.sortGender = function(a, b){
	let gender=["male", "female"];
	return gender.indexOf(a) - gender.indexOf(b);	
}

Utils.prototype.setLoader = function(elem) {
	this.loaderText = $(elem).html();
	$(elem).html('<paper-spinner style="width:20px; height:20px;" active></paper-spinner>');
}

Utils.prototype.removeLoader = function(elem) {
	$(elem).html(this.loaderText);
}

Utils.prototype.getURLParam = function(param) {
	let url = new URL(document.URL);
	return url.searchParams.get(param);
}

Utils.prototype.getUserIdEntity = function(param) {
	return JSON.parse(localStorage.accountData).userHeader.roleEntity.idEntity;
}

Utils.prototype.getWebStyles = function() {
	let mode = JSON.parse(localStorage.accountData).userHeader.frontStyle;
	return mode || 'infinia';
}

Utils.prototype.getPieColors = function() {
	let mode = JSON.parse(localStorage.accountData).userHeader.frontStyle;
	mode = mode || 'infinia';
	let data = {infinia:'primary', omnia:'blue', digital_signage:'red'};
	
	return data[mode];
}

Utils.prototype.resetDate = function(date) {
	date.setHours(0,0,0)
	date.setMilliseconds(0);
}

Utils.prototype.daysBetween = function(date1, date2) {

    // The number of milliseconds in one day
    var ONE_DAY = 1000 * 60 * 60 * 24

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime()
    var date2_ms = date2.getTime()

    // Calculate the difference in milliseconds
    var difference_ms = Math.abs(date1_ms - date2_ms)

    // Convert back to days and return
    return Math.round(difference_ms/ONE_DAY)

}

Utils.prototype.datesDepending = function(from, to) {
	utils.datesDependingObj($('#'+from), $('#'+to));
}

Utils.prototype.datesDependingObj = function(from, to) {
	from.on('dateSelected', function(e) {
		if(e.detail > to[0].getValue()) {
			to[0].reset();
		}
		to[0].setMinDate(new Date(e.detail));
	})
}

Utils.prototype.drawPies = function(response, container, color) {
	let total = 0;
	let sum = 0;
	response.forEach((elem) => {
		let data = [["",""]];
		let chartName = elem.name;
		let fun = utils.getSortFunction(elem.name);
		if(typeof fun == "function") {
			elem.values.sort((a, b) => {
				return fun(a.value,b.value); 
			})
		};
		let total = 0;
		let max = 0;
		let top = "-";
		elem.values.forEach((el) => {
			total += el.quantity;
			if(el.quantity > max) {
				top = el.value;
				max = el.quantity;
			}
		})
		
		if(top.startsWith('income')) {
			top = "income."+top;
		}
		
		$('#summary-data').prop(elem.name,localizer.get(top));
		
		if(total == 0) total = 1;
		
		elem.values.forEach((el) => {
			if(el.value) {
				let str = el.value;
				if(el.value.startsWith("income"))
					str = "income."+el.value;
				data.push([localizer.get(str) + " ("+Number(el.quantity /total * 100).toFixed(1).toLocaleString()+"%)", el.quantity]);
				sum+=el.quantity;
			}
		})
		
		if($('#'+container).find('#'+elem.name+'Card').length > 0) {
			let chart = new PieChart();
			chart.setData(data);
			$('#'+container).find('#'+elem.name+'Card').html(chart);
			if(color)
				chart.colorSelected = color;
			chart.graphTitle = chartName;
			chart.drawChart();
		}
		if(total == 0) {
			total = sum;
			$('#'+container).find('.demographic-total').html("Total: " +total.toLocaleString());
		}
	})
}

Utils.prototype.agencyLinkSelectBehavior = function () {
	if ($("#lookalike-selector").val() == "") {
		$("#linkLookIcon").addClass("hide");
		$("#lookSelectContainer").removeClass("col-sm-10");
		$("#lookSelectContainer").addClass("col-sm-12");
		
		$("#lookIconContainer").removeClass("col-sm-2");
		$("#lookIconContainer").addClass("col-sm-0");
	}else{
		$("#linkLookIcon").removeClass("hide");
		
		$("#lookSelectContainer").removeClass("col-sm-12");
		$("#lookSelectContainer").addClass("col-sm-10");
		
		$("#lookIconContainer").removeClass("col-sm-0");
		$("#lookIconContainer").addClass("col-sm-2");
		
		
	}
}


Utils.prototype.agencyLinkType = function(type, elemId) {
	
	var linkType = type;
	var clusterId = elemId;
	var selectedLevel;
	var successMessage;
	var windowTitle;
	
	if (linkType == "cluster") {
		selectedLevel = clusterId;
		windowTitle = "Asociar Cluster a Agencia";
		successMessage = "El cluster se ha asociado correctamente a agencia.";
	}
	else if (linkType == "lookalike") {
		selectedLevel = $("#lookalike-selector").val();
		windowTitle = "Asociar Lookalike a Agencia";
		successMessage = "El lookalike ha sido asociado a la agencia satisfactoriamente.";
	}
	
	let accountData = JSON.parse(localStorage.accountData);
	utils.get('/clusters/agency_link/template',{}, function(response) {
		utils.modal(windowTitle, response);
		utils.post("/api/components/selects", JSON.stringify({
			"fields":[
				{
					"id" : accountData.userHeader.roleEntity.idEntity,
					"field" : "agencies"
				}
			]
		}), function(agencies) {
			$('#agency')[0].setList(agencies[0].options);
		});
		
		utils.get('/api/clusters/' + selectedLevel + '/agencies', {}, 
			(agencies) => {
				$.map(agencies, (agency) => {
				document.querySelector('#agency').accept({id: agency.id, value: agency.name});
			});
			},
			(error) => {
				console.log('Error getting cluster agencies', selectedLevel, error);
			});
		
		$('#save').on('click', function() {
    		var agencies = $('#agency')[0].getData();
    		agencies = $.map(agencies, (elem) => {
				return elem.id;
			});
    		
    		if (agencies.length > 0){
    			utils.lockScreen();
    			
	        		utils.get('/api/clusters/' + selectedLevel + '/_segment?agency_ids=' + agencies.join(), {}, 
       				(response) => {
       					utils.unlockScreen();
       					$('#modal')[0].close()
       					utils.floatingSuccess(successMessage)
       				},
       				(error) => {
   					utils.unlockScreen();
       					console.log('Error linking cluster', selectedLevel, error);
       					$('#modal')[0].close()
       				});
    		}
    	});
	});	
}

Utils.prototype.drawBulletGraph = function(div,response) {
	
	$('#psychographic-'+div).html("");
	
	switch(div){
	case "iab": 
		$('#psychographic-'+div).append('<h3>'+localizer.get('iab')+'</h3>');
		
		if (response.length === 0) {
			$('#psychographic-'+div).append('<p>'+localizer.get('noData')+'</p>');
		}
	break;
	case "keywords": 
		$('#psychographic-'+div).append('<h3>'+localizer.get('keywords')+'</h3>');
		
		if (response.length === 0) {
			$('#psychographic-'+div).append('<p>'+localizer.get('noData')+'</p>');
		}
	break;
	case "categories": 
		$('#psychographic-'+div).append('<h3>'+localizer.get('categories_app')+'</h3>');
		
		if (response.length === 0) {
			$('#psychographic-'+div).append('<p>'+localizer.get('noData')+'</p>');
		}
	break;
	case "apps": 
		$('#psychographic-'+div).append('<h3>'+localizer.get('apps')+'</h3>');
		
		if (response.length === 0) {
			$('#psychographic-'+div).append('<p>'+localizer.get('noData')+'</p>');
		}
	break;
	}
	
	let InfiniaBullet = customElements.get('infinia-bullet');
	
	for (var i = 0; i < 5; i++) {

		let infiniaBullet = new InfiniaBullet();
		
		infiniaBullet.appName = Object.values(response)[i].name;
		infiniaBullet.weightValue = Object.values(response)[i].weight;
		infiniaBullet.baseValue = Object.values(response)[i].base;

		
		if(infiniaBullet.weightValue>100)
            infiniaBullet.weightValue = Number(infiniaBullet.weightValue/100).toFixed(2);
		
		if(Object.values(response)[i].weight - Object.values(response)[i].base > 0)

			$('#psychographic-'+div).append(infiniaBullet);
		
	}
	

}


Utils.prototype.drawTable = function(div, data) {
	let InfiniaTable = customElements.get('infinia-table');
	let infiniaTable = new InfiniaTable();
	$('#psychographic-'+div).html(infiniaTable);
	
	let rows = [];
	//let tableTotals = 0;

//	JSON.parse(data).forEach((elem) => {
//		Object.keys(elem).forEach((key) => {
//			tableTotals += elem[key] // addition 
//		})
//	})
	try {
		JSON.parse(data).forEach((elem) => {
			Object.keys(elem).every((key) => {
				if(rows.length < 10) {
					rows.push({
						id:key,
						cells:[
							{id:0, value:key},{id:1, value:elem[key] }
						]
					})
				}
				else return false;
			})
	})
	}catch(Exception) {}
	
	
	infiniaTable.hidePagination();
	infiniaTable.disableSorting();
	infiniaTable.tableColumns = [{id:0, value:localizer.get(div)}, {id:1, value:localizer.get("total")}];
	
	infiniaTable.tableRows = rows;
	infiniaTable.disableDownload();
	infiniaTable.disableHeadFixed = true;
	if(rows.length > 0) {
		$('#summary-data').prop(div,rows[0].cells[0].value.replace('&amp;', '&'));	
	}
}


Utils.prototype.addCampaignPaymentTabs = function(response, tabs) {
	
	let tabCount = tabs.numTabs();
	let roles = ["ROLE_ADMIN", "ROLE_ADMIN_EDIT"];
	if(response.profiling || roles.includes(utils.getNameRole()) ) {
		tabs.addTab(tabCount,localizer.get('profiling'), "", "/campaigns/"+id_campaign+"/profile");
		tabCount++;
	}
	
	if(response.attributionModel || roles.includes(utils.getNameRole()) ) {
		tabs.addTab(tabCount,localizer.get('attribution_model'), "", "/campaigns/"+id_campaign+"/attribution_model");	
	}
}



Utils.prototype.fillTargetLists = function() {
	$('selectable-list[name="gender"]')[0].setList([
		{id:"male", value:localizer.get('male')},
		{id:"female", value:localizer.get('female')}
	])
	
	$('selectable-list[name="age"]')[0].setList([
		{id:"<12", value:"<12"},
		{id:"12-17", value:"12-17"},
		{id:"18-25", value:"18-25"},
		{id:"26-40", value:"26-40"},
		{id:"41-55", value:"41-55"},
		{id:">55", value:">55"},
	])
	
	$('selectable-list[name="income_level"]')[0].setList([
		{id:"income_E", value:localizer.get('income.income_E')},
		{id:"income_D", value:localizer.get('income.income_D')},
		{id:"income_C", value:localizer.get('income.income_C')},
		{id:"income_B", value:localizer.get('income.income_B')},
		{id:"income_A", value:localizer.get('income.income_A')},
	])
	
	
	$('selectable-list[name="nationality"]')[0].setList([
		{id:"AR", value:"Argentina"},
		{id:"BR", value:"Brasil"},
		{id:"CL", value:"Chile"},
		{id:"CO", value:"Colombia"},
		{id:"CR", value:"Costa Rica"},
		{id:"EC", value:"Ecuador"},
		{id:"SV", value:"El Salvador"},
		{id:"GT", value:"Guatemala"},
		{id:"HN", value:"Honduras"},
		{id:"MX", value:"México"},
		{id:"NI", value:"Nicaragua"},
		{id:"PA", value:"Panamá"},
		{id:"PY", value:"Paraguay"},
		{id:"PE", value:"Perú"},
		{id:"PR", value:"Puerto Rico"},
		{id:"DO", value:"República Dominicana"},
		{id:"UY", value:"Uruguay"},
		{id:"ES", value:"España"}
	]);
}

Utils.prototype.replaceAll = function(target, search, replacement) {
    return target.replace(new RegExp(search, 'g'), replacement);
};





//user agent check  (browser check)


//Get IE or Edge browser version

Utils.prototype.checkNavigator = function() {

	  var ua = window.navigator.userAgent;
	  
	  var msie = ua.indexOf('MSIE ');
	  if (msie > 0) {
	    // IE 10 or older 
		  console.log("MSIE")
	    return currentBrowser = "IE";
	  }

	  var trident = ua.indexOf('Trident/');
	  if (trident > 0) {
	    // IE 11 
	    var rv = ua.indexOf('rv:');
	    console.log("TRIDENT, LEGACY IE")
	    return currentBrowser = "IE11";
	  }

	  var edge = ua.indexOf('Edge/');
	  if (edge > 0) {
	    // Edge (IE 12+)
		  console.log("EDGE")
	    return currentBrowser = "Edge";
	  }

	  // other browser
	  var chrome = ua.indexOf('Chrome/');
	  if (chrome > 0) {
	    // Chrome, Webkit, Gecko
		  console.log("CHROME/WEBKIT/GECKO")
		  $(".browser-warning").addClass("ok-browser");
	    return currentBrowser = "other";
	  }

}

Utils.prototype.openInfiniaPopup = function() {
	$('infinia-popup')[0].startPopup();
}

