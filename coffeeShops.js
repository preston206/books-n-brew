var map;
var infoWindow;

function initMap() {
    console.log("init");
    // var mapFocus = new google.maps.LatLng(47.708346, -122.181258);
    var mapFocus = new google.maps.LatLng(47.708346, -122.181258);
    map = new google.maps.Map(document.getElementById('map'), {
        center: mapFocus,
        zoom: 13,
        scaleControl: true,
    });

    request = {
        location: mapFocus,
        // radius: 8047, // about 5mi
        radius: 850,
        types: ['cafe'],
    };

    var input = document.getElementById('coffee-shop-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    infoWindow = new google.maps.InfoWindow();

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
}

function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        console.log("callback ok");

        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        };
    };
}

function createMarker(place) {
    console.log("marker");
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
    });

    google.maps.event.addListener(marker, 'click', function () {
        console.log("listener ok");
        var contentString =
            `<img src="${place.icon}" /><br />
                    ${place.name}<br />
                    Rating: ${place.rating} stars<br />
                    Address: ${place.vicinity}`

        infoWindow.setContent(contentString);
        infoWindow.open(map, this);

        service.getDetails({ placeId: place.place_id }, function (place, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {

                // request.placeId = place.place_id;

                var results = "";

                place.reviews.map(function (review) {
                    results += `<div><span class="reviews-background">Review written about ${review.relative_time_description}</span><br />
                    <span class="reviews-border reviews-background">Customer Rating: ${review.rating} stars</span><br />
                        <span>${review.text}</span></div><br />`;

                    // results.find('span.customer-rating').addClass('rating-border');

                    $('#reviews').html(results);
                });
            }
        })
    });
}

$('#coffee-shop-search').submit(function (event) {
    event.preventDefault();
    var userInput = $('form input').val();

})