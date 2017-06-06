var infoWindow;

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 47.708346, lng: -122.181258 },
        zoom: 13,
        scaleControl: true
    });
    $('.controls').show();

    infoWindow = new google.maps.InfoWindow();
    service = new google.maps.places.PlacesService(map);

    // Create the search box and link it to the UI element.
    var input = document.getElementById('coffee-shop-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });

    var markers = [];

    function removeMarkers() {
        for (i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
    }

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
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
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(20, 20)
            };

            // Create a marker for each place.
            // markers.push(new google.maps.Marker({
            //     map: map,
            //     icon: icon,
            //     title: place.name,
            //     position: place.geometry.location
            // }));

            marker = new google.maps.Marker({
                map: map,
                icon: icon,
                position: place.geometry.location,
            });

            markers.push(marker);

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
            // console.log("selected place 1", state.selectedCoffeeShop);
            google.maps.event.addListener(marker, 'click', function () {

                console.log("listener ok");


                service.getDetails({ placeId: place.place_id }, function (place, status) {
                    if (status == google.maps.places.PlacesServiceStatus.OK) {

                        var results = [];
                        // var coffeeShopSelect = 
                        $('#coffeeShopBtn').click(function (event) {
                            state.selectedCoffeeShop = place;
                            localStorage.state = JSON.stringify(state);
                            // console.log("selected place 2", state.selectedCoffeeShop);
                        });
                        // results.push(coffeeShopSelect);

                        place.reviews.map(function (review) {
                            let html = $(`<div><span class="coffee-review-background">Review written ${review.relative_time_description}</span><br />
                    <span class="coffee-review-border coffee-reviews-background">Customer Rating: ${review.rating} stars</span>
                        <div class="coffee-review-text">${review.text}</div></div><br />`);

                            results.push(html);

                        });
                        $('#coffee-shop-reviews').html(results);

                        contentString =
                            `<img src="${place.icon}" /><br />
                    ${place.name}<br />
                    Rating: ${place.rating} stars<br />
                    Address: ${place.vicinity}`;

                    }
                    infoWindow.setContent(contentString);

                })
                $('#coffeeShopBtn').attr('disabled', false);
                infoWindow.setContent();
                infoWindow.open(map, this);

            });

        });
        map.fitBounds(bounds);

    });
}
