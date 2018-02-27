
class CartoUtils {
	
	static getAccountData() {
		
		let environment = "production";
		
		let data = {
			test: {
				account_name:"infinia-tester-admin",
				api_key:"069c926efe828ef05c22fdbdeea16a36a27bcdce"
			},
			production: {
				account_name:"infiniamaps",
				api_key:"faf8ad771e162441a5f299ada5e044e63e2a2ed9"
			}
		}
		return data[environment];
	}
	
	static getProfileQueryPoints(type, section, id,  where) {
		where = where || "";
		return "select ld.cartodb_id, ld.the_geom_webmercator, ld.name FROM infiniamaps."+type+"_"+section+"_"+id +where;
	}
	
	static getProfileQueryProvinces(type, section, id,  where) {
		where = where || "";
		return "select ld.cartodb_id, ld.the_geom_webmercator, ld.name, subq.coun from (SELECT level1 ,count(*) as coun FROM infiniamaps."+type+"_"+section+"_"+id+" "+where+" group by level1) subq inner join location_data ld on ld.cartodb_id = subq.level1 order by coun desc "
	}
	
	
	
	static getProfileQueryMunicipalities(type, section, id,  where) {
		where = where || "";
		return "select ld.cartodb_id, ld.the_geom_webmercator, ld.name, subq.coun from (SELECT level2 ,count(*) as coun FROM infiniamaps."+type+"_"+section+"_"+id+" "+where+" group by level2) subq inner join location_data ld on ld.cartodb_id = subq.level2 order by coun desc"
	}
	
	static getProfileQueryDistricts(type, section, id, where) {
		where = where || "";
		return "select ld.cartodb_id, ld.the_geom_webmercator, ld.name, subq.coun from (SELECT level3 ,count(*) as coun FROM infiniamaps."+type+"_"+section+"_"+id+" "+where+" group by level3) subq inner join location_data ld on ld.cartodb_id = subq.level3  order by coun desc"
	}
	
	
	
	//@deprecated
	static getClusterHomeQuery(clusterId) {
		return "select cartodb_id, the_geom, the_geom_webmercator from cluster_homeplace where id_cluster = '"+clusterId+"'";
	}
	
	static getClusterWorkQuery(clusterId) {
		return "select cartodb_id, the_geom, the_geom_webmercator from cluster_workplace where id_cluster = '"+clusterId+"'";
	}
	
	static getClusterVitalZoneQuery(clusterId) {
		return "select cartodb_id, the_geom, the_geom_webmercator from cluster_vitalzone where id_cluster = '"+clusterId+"'";
	}
	
	static getCampaignHomeQuery(campaignId,suffix) {
		suffix = suffix || "";
		return "select cartodb_id, the_geom, the_geom_webmercator from campaign_homeplace"+suffix+" where id_campaign = '"+campaignId+"'";
	}
	static getCampaignWorkQuery(campaignId,suffix) {
		suffix = suffix || "";
		return "select cartodb_id, the_geom, the_geom_webmercator from campaign_workplace"+suffix+" where id_campaign = '"+campaignId+"'";
	}
	static getCampaignVitalZoneQuery(campaignId,suffix) {
		suffix = suffix || "";
		return "select cartodb_id, the_geom, the_geom_webmercator from campaign_vitalzone"+suffix+" where id_campaign = '"+campaignId+"'";
	}
	
	static getProfileHomeQuery() {
		return "select cartodb_id, the_geom, the_geom_webmercator from profile_home";
	}
	
	static getStyle(style) {
		let styles = {
			red : '#layer { marker-width: 5; marker-fill: #EE4D5A; marker-fill-opacity: 0.9; marker-allow-overlap: true; marker-line-width: 0; marker-line-color: #EE4D5A; marker-line-opacity: 1; marker-comp-op: multiply; }',
		
			'mainHeatMap':'#layer { image-filters: colorize-alpha(blue,yellow,white, cyan, #008000, yellow , orange, #FF4040); marker-file: url(https://s3-eu-west-1.amazonaws.com/carto-data/alphamarkerINFv3.png); marker-fill-opacity: 0.1; marker-width: 20; marker-allow-overlap: true;} ',
			'vitalzoneHeatMap':'#layer { image-filters: colorize-alpha(blue,yellow,white, cyan, #008000, yellow , orange, #FF4040); marker-file: url(https://s3-eu-west-1.amazonaws.com/carto-data/alphamarkerINFbig2.png); marker-fill-opacity: 0.0; marker-width: 25; marker-allow-overlap: true;} ',
			'income_level:income_E':'#layer { image-filters: colorize-alpha(#EF9A9A, #EF5350, #E53935, #C62828, #FF8A80, #E040FB); marker-file: url(https://s3-eu-west-1.amazonaws.com/carto-data/alphamarker.png); marker-fill-opacity: 0.1; marker-width: 20; marker-allow-overlap: true;} ',
			'income_level:income_D':'#layer { image-filters: colorize-alpha(#42A5F5, #2196F3, #1E88E5, #1565C0, #82B1FF, #2979FF); marker-file: url(https://s3-eu-west-1.amazonaws.com/carto-data/alphamarker.png); marker-fill-opacity: 0.1; marker-width: 20; marker-allow-overlap: true;} ',
			'income_level:income_C':'#layer { image-filters: colorize-alpha(#4DD0E1, #00BCD4, #0097A7, #00B8D4, #18FFFF, #00E5FF); marker-file: url(https://s3-eu-west-1.amazonaws.com/carto-data/alphamarker.png); marker-fill-opacity: 0.1; marker-width: 20; marker-allow-overlap: true;} ',
			'income_level:income_B':'#layer { image-filters: colorize-alpha(#DCE775, #CDDC39, #AFB42B, #827717, #EEFF41, #AEEA00); marker-file: url(https://s3-eu-west-1.amazonaws.com/carto-data/alphamarker.png); marker-fill-opacity: 0.1; marker-width: 20; marker-allow-overlap: true;} ',
			'income_level:income_A':'#layer { image-filters: colorize-alpha(#FFF3E0, #FFE0B2, #FFB74D, #FF9800, #F57C00, #E65100); marker-file: url(https://s3-eu-west-1.amazonaws.com/carto-data/alphamarker.png); marker-fill-opacity: 0.1; marker-width: 20; marker-allow-overlap: true;} ',
			'age:>55':'#layer { image-filters: colorize-alpha(#FFF3E0, #A5D6A7, #66BB6A, #388E3C, #B9F6CA, #00E676); marker-file: url(https://s3-eu-west-1.amazonaws.com/carto-data/alphamarker.png); marker-fill-opacity: 0.1; marker-width: 20; marker-allow-overlap: true;} '
		}
		styles['age:<12'] = styles['income_level:income_E'];
		styles['age:12-17'] = styles['income_level:income_D'];
		styles['age:18-25'] = styles['income_level:income_C'];
		styles['age:26-40'] = styles['income_level:income_B'];
		styles['age:41-55'] = styles['income_level:income_A'];
		styles['gender:male'] = styles['income_level:income_A'];
		styles['gender:female'] = styles['income_level:income_D'];

		styles['polygonStyle'] = '#layer { opacity:0.9;   polygon-fill: ramp([coun], (#fbe6c5, #f5ba98, #ee8a82, #dc7176, #c8586c, #9c3f5d, #70284a), jenks);} #layer::outline {   line-width: 0.5;   line-color: #d6d9ea;   line-opacity: 1; }';

		styles['points'] = "#layer {marker-width: 7;marker-fill: #EE4D5A;marker-fill-opacity: 0.9;marker-allow-overlap: true;marker-line-width: 1;marker-line-color: #FFFFFF;marker-line-opacity: 1;}";
		
		styles['districtStyle'] = '#layer {      [count > 1] { polygon-fill:#B2DFDB; }    [count >= 3]   { polygon-fill:#80CBC4; }     [count >= 6] { polygon-fill:#4DB6AC; }      [count >= 10] { polygon-fill:#26A69A; }       [count >= 15] { polygon-fill:#009688; }       [count >= 21] { polygon-fill:#00897B; }       [count >= 30] { polygon-fill:#00796B; }       [count >= 50] { polygon-fill:#00695C; }       [count >= 100] { polygon-fill:#004D40; }     }  #layer::outline {  line-width: 0.5;  line-color: #FFFFFF;  line-opacity: 0.5;}';
		styles['municipalityStyle'] = "#layer {      [count > 1] { polygon-fill:#B2DFDB; }    [count >= 10]   { polygon-fill:#80CBC4; }     [count >= 20] { polygon-fill:#4DB6AC; }      [count >= 30] { polygon-fill:#26A69A; }       [count >= 50] { polygon-fill:#009688; }       [count >= 80] { polygon-fill:#00897B; }       [count >= 130] { polygon-fill:#00796B; }       [count >= 210] { polygon-fill:#00695C; }       [count >= 340] { polygon-fill:#004D40; }     } #layer::outline {  line-width: 0.5;  line-color: #FFFFFF;  line-opacity: 0.5;}" ;
		
		styles['pointRadius'] = "#layer { polygon-fill:#EE4D5A; }   #layer::outline {  line-width: 0.5;  line-color: #FFFFFF;  line-opacity: 0.5;}" ;
		
		styles['players'] = "#layer { marker-width:8; marker-allow-overlap: true;  marker-fill: ramp([count], (#E4F1E1, #9CCDC1, #63A6A0, #337F7F, #0D585F), quantiles);    } #layer::outline {   marker-line-width: 0;   marker-line-color: #ffffff;   marker-line-opacity: 1; }";
		
		
		return styles[style];
	}
	
	
}

