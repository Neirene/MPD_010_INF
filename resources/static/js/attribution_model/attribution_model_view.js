
let colors = {
		primary:['#012c40', '#004866', '#006c99', '#009fe3', '#39beff', '#90d9fd'],
		blue: ['#012c40', '#004866', '#006c99', '#009fe3', '#39beff', '#90d9fd'],
		red:['#691725','#8c1f31','#af273e','#b73c51','#c76777', '#d7939e' ]
}
var vennColours = colors;
let categories = [];
let values = [];
let drawValues=[];
let dates = [];
if(id_model) {
	utils.get('/api/ma/'+id_model+'/statistics', {}, (response) => {


		if(!response) return;
		
		console.log(response);
		$('#name').html(response.containerName);
		drawVennGraph(response);
		
		response.stats.forEach((elem, i) => {

			categories.push(elem.name);
			values.push(elem.value);
			
			if(response.stats[i].value == "Pending")
				drawValues.push("Pending");
			else {
				if(i == 0)
					drawValues.push(response.stats[0].value);
					
				if(i>0 && response.stats[i-1].value != "Pending") {
					let ratio = Number(elem.value) / (response.stats[i-1].value) * 100;
					if(ratio < 40) {
						drawValues.push(response.stats[i-1].value * 40 / 100);
					}
					else {
						drawValues.push(elem.value);
					}
				}
			}
			
			if(elem.startDate)
				dates.push(utils.formatDate(new Date(elem.startDate), true) +" - "+utils.formatDate(new Date(elem.endDate), true));
			else dates.push('');
		})
		
		
		
		let provider = [];
		values.forEach((elem, index) => {
			
			let val = drawValues[index] == "Pending" ? 0 : drawValues[index];
			
			provider.push({
				category: categories[index],
				value:val,
				value2:-1*val,
				color:colors[utils.getPieColors()][index]
			})
			
			let users = drawValues[index] == "Pending" ? "Pendiente" : Number(values[index]).toLocaleString();
			let str = '<div style="color:'+colors[utils.getPieColors()][index]+'">'+users;
			
			if(index > 0) {
				let pct = drawValues[index] == "Pending" ? "-": Number((values[index] / values[index -1] * 100).toFixed(2)).toLocaleString()+"%";
				str += '<br><span class="sm">ratio: <span style="font-size:15pt; font-weight:bold;color:'+colors[utils.getPieColors()][index]+';">'+pct+'</span></span>';
			}

			
			str += '</div>';
			$('#values').append(str);
		})
		
		dates.forEach((elem) => {
			$('#dates').append('<div class="sm">'+elem+'</div>')
		})
		provider.push(provider[provider.length-1]);
		
		let data = {
			    "type": "serial",
			    "theme": "none",
			    "dataProvider": provider,
			    "valueAxes": [{
			        "axisAlpha": 0,
			        "labelsEnabled": false,
			        "gridAlpha": 0
			    }],
			    "graphs": [{
			        "id": "fromGraph",
			        "lineAlpha": 0,
			        "showBalloon": false,
			        "valueField": "value2",
			        "fillAlphas": 0
			    }, {
			        "fillAlphas": 1,
			        "fillToGraph": "fromGraph",
			        "lineAlpha": 0,
			        "lineColorField": "color",
			        "fillColorsField": "color",
			        "showBalloon": false,
			        "valueField": "value"
			    }],
			    "categoryField": "category",
			    "categoryAxis": {
			        "startOnAxis": true,
			        "axisAlpha": 0.1,
			        "gridPosition": "left",
			        "gridAlpha": 0.1,
			        "tickLength": 20,
			        "tickPosition": "start",
			        "showLastLabel": false
			    }
			}

		var chart = AmCharts.makeChart("chartdiv", data);
	})	
	
}

function drawVennGraph(response) {
	let sets = [];
	let clusters=[];
	let intersections=[];
	let main;
	response.statsCircle.forEach((elem, i) => {
		if(elem) {
			if(elem.value != "Pending") {
				sets.push({sets:[elem.name], size:elem.totalValue});
				clusters.push({name:elem.name, value:elem.totalValue});
				if(elem.clusters.length == 1) {
					main = elem.name;
				}
				else {
					sets.push({sets:[main, elem.name], size:elem.value});
					intersections.push({name:elem.name + " - "+main, value:elem.value});
				}
			}
		}
	})
	
	if(clusters.length > 0) {
		$('#venn_stats').append('<li class="list-group-item" style="background-color:#ddd">Clusters</li>');
		
		clusters.forEach((elem, index) => {
			$('#venn_stats').append('<li class="list-group-item" style="color:'+vennColours[utils.getPieColors()][index]+'">'+
					elem.name+': '+Number(elem.value).toLocaleString()+' usuarios</li>');
			
		})
	}
	
	if(intersections.length > 0) {
		$('#venn_stats').append('<li class="list-group-item" style="background-color:#ddd">Intersecciones</li>');
		intersections.forEach((elem, index) => {
			$('#venn_stats').append('<li class="list-group-item">'+elem.name+': '+Number(elem.value).toLocaleString()+' usuarios</li>');
			
		})
	}
	
	if(clusters.length == 0 && intersections.length == 0) {
		$('#venn').append('Pendiente');
	}
	
	if(sets.length > 0) {
		
		var chart = venn.VennDiagram();
		d3.select("#venn").datum(sets).call(chart);
		d3.selectAll("#venn .venn-circle path")
			.style("fill-opacity", 0.3)
			.style("stroke-width", 5)
			.style("stroke-opacity", .5)
			.style("stroke", function(d,i) { return vennColours[utils.getPieColors()][i] })
			.style("fill", function(d,i) { return vennColours[utils.getPieColors()][i] });

		d3.selectAll("#venn .venn-circle text")
		.style("fill", function(d,i) { return vennColours[utils.getPieColors()][i]})
		.style("font-size", "12px")
		.style("font-weight", "100");
	}


}