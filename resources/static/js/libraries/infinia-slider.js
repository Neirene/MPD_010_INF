
function InfiniaSlider(id){
	this.slider = $('#'+id);
	this.current;
};
infiniaSlider = new InfiniaSlider();

InfiniaSlider.prototype.init = function() {
	this.current = 0;
	this.slider.children().addClass('hidden');
	this.slider.children().first().removeClass('hidden');
}

InfiniaSlider.prototype.goTo = function(i) {
	this.current = i;
	this.slider.children().addClass('hidden');
	$(this.slider.children().get(i)).removeClass('hidden');
}

InfiniaSlider.prototype.getCurrent = function() {
	return this.current;
}