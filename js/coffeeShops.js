
// if browser can't get user location, this will hard code it
function defaultLoc() {
    state.userLat = 47.708346;
    state.userLng = -122.181258;
    initMap();
}

// if browser is successful at getting user location this will run
function success(position) {
    state.userLat = position.coords.latitude;
    state.userLng = position.coords.longitude;
    state.userLoc = { lat: state.userLat, lng: state.userLng };
    initMap();
}

// geolocation error handling
function getError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            console.log("User denied the request for Geolocation.");
            defaultLoc();
            break;
        case error.POSITION_UNAVAILABLE:
            console.log("Location information is unavailable.");
            defaultLoc();
            break;
        case error.TIMEOUT:
            console.log("The request to get user location timed out.");
            defaultLoc();
            break;
        case error.UNKNOWN_ERROR:
            console.log("An unknown error occurred.");
            defaultLoc();
            break;
    }
}

// this attempts to get the user's location
function getLoc() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, getError);
    }

    else {
        console.log("Geolocation is not supported by this browser");
        defaultLoc();
    }
}

// initialize the map
function initMap() {

    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: state.userLat, lng: state.userLng },
        zoom: 13,
        scaleControl: true
    });

    // display the search input
    $('#coffee-shop-input').show();

    var infoWindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);

    // Create the search box and link it to the UI element.
    var input = document.getElementById('coffee-shop-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });

    var markers = [];

    // call this to clear the map of markers
    function removeMarkers() {
        for (i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
    }

    // Listen for places_changed event when the user enters a city
    searchBox.addListener('places_changed', function () {

        // display tagline
        // $('.coffee-shop-search-tagline-2').show();
        $('.coffee-shop-search-tagline-2').removeClass('hidden-tagline');

        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // clear map, clear reviews, hide button
        removeMarkers();
        $('#coffee-shop-reviews').empty();
        $('#coffeeShopBtn').attr('disabled', true);


        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }

            if (place.types[0] === "cafe") {

                var icon = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(20, 20)
                };

                // marker settings
                marker = new google.maps.Marker({
                    map: map,
                    icon: icon,
                    title: place.name,
                    position: place.geometry.location,
                });

                // Create a marker for each place
                markers.push(marker);

                if (place.geometry.viewport) {
                    // Only geocodes have viewport.
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }

                google.maps.event.addListener(marker, 'click', function () {

                    // get coffee shop details
                    service.getDetails({ placeId: place.place_id }, function (place, status) {
                        if (status == google.maps.places.PlacesServiceStatus.OK) {

                            var results = [];

                            state.selectedCoffeeShop = place;

                            // populate side panel with coffee shop reviews
                            place.reviews.map(function (review) {
                                let html = $(`<div class="coffee-review"><div class="coffee-review-background"><span>Review written ${review.relative_time_description}</span><br />
                    <span>Customer Rating: ${review.rating} stars</span></div>
                        <div class="coffee-review-text">${review.text}</div></div><br />`);

                                results.push(html);
                            });
                            $('#coffee-shop-reviews').html(results);

                            // map popup window with coffee shop info
                            contentString =
                                `<img src="${place.icon}" /><br />
                    ${place.name}<br />
                    Rating: ${place.rating} stars<br />
                    Address: ${place.vicinity}`;

                        }
                        infoWindow.setContent(contentString);

                    })
                    $('#coffeeShopBtn').attr('disabled', false);

                    // clearing the map popup window
                    infoWindow.setContent();
                    infoWindow.open(map, this);

                });
            }
        });

        map.fitBounds(bounds);
    });
}

// listens for button click to select the coffee shop, then transitions to next page
$('#coffeeShopBtn').click(function (event) {
    state.selectedCoffeeShopAddress = state.selectedCoffeeShop.formatted_address;
    // localStorage.state = JSON.stringify(state);
    $('.find-coffee-shop-page').addClass('hide');
    $('.final-page').removeClass('hide-map');
    $('body').addClass('final-bg');
    headerState(3);
    initFinalMap();
});