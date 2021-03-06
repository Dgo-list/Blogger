
$( document ).ready(function() {
	//Loads images page on menu click
	$('#flex-menu-3').click(function(){
		window.location.href = "../templates/images.html";
	});

	$('#flex-menu-2').click(function(){
		window.location.href = "../templates/blog.html";
	});

	$('#flex-menu-1').click(function(){
		window.location.href = "../templates/trip.html";
	});

	var geojson =[];
	function getLocations(){
	$.ajax({
		method: "GET",
		url: "http://api.blogger.danielbetteridge.com/locations?format=json",
		success: function(data){
			locations = data;
			console.log(locations);
			
			locations.forEach(function addLocation(location){
				geojson = buildGeoJSON(location);
			});
			
				
      		loadMap(geojson);
    				
		}
	});
	};

	getLocations();

	//Builds geoJSON objects for each location, filling in description and location for marker
	function buildGeoJSON(location) {
		var locationjson = {
							type: location.LocationTypeGeoJSON, 
							properties: {
								title: location.Landmark,								 
								description: location.LandmarkDescription

							},
							geometry: { 
								type: "Point", 
								coordinates: [location.Longitude, location.Latitude]
							}
						}
		geojson.push(locationjson);
		return geojson;
	};

	//Loads map to html element with id of abs-map-i and uses coordinates, name and zoom level set in location
	function loadMap(geojson) {

		
				
					L.mapbox.accessToken = 'pk.eyJ1IjoiZGFuaWVsYmV0dGVyaWRnZSIsImEiOiJjaWY3bjZqazcwc3IzczdrcmU1NjJ1czdnIn0.Xr0sZHMxs6Fvp7lzmmtJSg';
					var mapboxTiles = L.tileLayer('https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=' + L.mapbox.accessToken, {
    					attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
					});

					var map = L.map('abs-map-0')
						.addLayer(mapboxTiles)
						.setView([39.50, -98.35], 4);

					L.mapbox.featureLayer().setGeoJSON(geojson).addTo(map);

					// Add a new line to the map with no points.
					var polyline = L.polyline([]).addTo(map);
					// For each point in the geojson data , create line between it and the previous point
					geojson.forEach(function addPoint(geo){
						polyline.addLatLng(
        					L.latLng(geo.geometry.coordinates[1], geo.geometry.coordinates[0]));
					});
		
	};


});

