
class ContentCreate {
	
	constructor() {
		this.contents = [];
	}
	
	setEvents() {
		
		let _this = this;
		
		localizer.translate();
		
		$('#all-days').on('checked-changed', function() {
			$('.weekDay').each((index, cb) => {
				if(this.checked)	
					cb.checked = true;
				else
					cb.checked = false;
			})
		})
		let hours = [];
		for(let i=0; i<24; i++) {
			hours.push({id:i, value:utils.formatToTwoDigits(i)});
		}
		$('#start_hour')[0].options = hours;
		$('#end_hour')[0].options = hours;
		
		let mins = [];
		for(let i=0; i<60;i++) {
			mins.push({id:i, value:utils.formatToTwoDigits(i)});
		}
		$('#start_min')[0].options = mins;
		$('#end_min')[0].options = mins;
		
		utils.loadHourSelectors();	

		utils.datesDepending('startDate', 'endDate');
		setTimeout(() => {
			$('#start_hour')[0].setValue(0);
			$('#start_min')[0].setValue(0);

			$('#end_hour')[0].setValue(23);
			$('#end_min')[0].setValue(59);
			
		}, 100)
		

		$('#save-content').on('click', function(e) {
			
			if(utils.validateRequired('content-form')) {
				
				
				var fd = utils.getFormAsObject('content-form');
				fd.id = 0;
				
				if (fd.idBlocks && fd.idBlocks !== ""){
					fd.idBlocks = fd.idBlocks.split(",");
				}
				else {
					fd.idBlocks = [];
				}
				if (fd.idPlaylists && fd.idPlaylists !== ""){
					fd.idPlaylists = fd.idPlaylists.split(",");
				}
				else {
					fd.idPlaylists = [];
				}
				
				let days = "";
				$('.weekDay').each(function(index, elem) {
					days += $(elem).prop('checked') ? "1":"0";
				})
				
				fd.week = days;
				
				fd.startTime = Number($('#start_hour').val()) * 60 + Number($('#start_min').val());
				fd.endTime = Number($('#end_hour').val()) * 60 + Number($('#end_min').val());
				
				if(fd.startHour > fd.endHour) {
					utils.floatingError('La hora de inicio debe ser anterior a la de fin');
					return false;
				}
				
				let correct = true;
				var contentName = fd.name;
				utils.lockScreen();
				
				$('file-loader')[0].uploadFiles('admira_contents').then(function(files) {
					try {
						var promiseArray = [];
						
						if(!files) throw new MissingImageException();
						
						for (var i=0; i<files.length; i++){
							
							var promise = new Promise((resolve, reject) => {
								if(files[i]){
									fd.fileUrl = JSON.stringify(files[i]);
									fd.name = contentName;
									resolve();
								}
							});
							promiseArray.push(promise);
						}
						
						Promise.all(promiseArray).then(values => {
							utils.unlockScreen();
							_this.contents.push(fd);
							$('#modal')[0].close();
							var event = new CustomEvent('contentAdded', {'detail':fd});
							window.dispatchEvent(event)
							
						}).catch(error => {
							utils.unlockScreen();
							alert(error);
						});
					} catch (MissingImageException){
						utils.floatingError("Debe adjuntar un archivo");
						utils.unlockScreen();
						return;
					}
				});
			}
		})

	}
}



