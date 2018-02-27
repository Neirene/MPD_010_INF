

class Localizer {

	get(textId) {
		if(!textId)
			return "";
		
		var lan = 'es'; 
		if(typeof text_localization !== "undefined")
			lan = text_localization;
		
		var textSplit = textId.split('.');
		
	
		textsLocalization.some((tl) => {
			var text = tl[textSplit[0]];
			for(var i=1;i<textSplit.length; i++){
				if(text && textSplit[i])
				text = text[textSplit[i]];
			}
			
			if(text && text[lan]) {
				textId = text[lan];
				return true;
			}
		})
		
		return textId;
	}
	
	translate() {
		var _this = this;
		$('*[data-text]').each(function(index, elem){
			if(elem.nodeName != 'INFINIA-TABS') {
				let text = _this.get($(this).data('text').replace("-", ""));
				if($(elem).data('uppercase') == true)
					text = text.toUpperCase();
				$(elem).html(text);
			}
			
		})
		$('paper-input, paper-typeahead').each(function(index, elem) {
			elem.label = _this.get(elem.label);
		})
		
		
	}

}

var localizer = new Localizer();


$(document).ready(function() {
	localizer.translate();
})