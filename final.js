console.log("selected coffee shop", state.selectedCoffeeShop);
console.log("selected book", state.selectedBook);


// TODO: add "Walking" directions Option



function insertBookAndCoffeeShopInfo() {
    $('.selected-book-name').html(state.selectedBook.volumeInfo.title);
    $('.selected-book-url').html(`<a href="${state.selectedBook.saleInfo.buyLink}" target="_blank">https://play.google.com/store/books/</a>`);
    $('.selected-coffee-shop-name').html(state.selectedCoffeeShop.name);
    $('.selected-coffee-shop-vicinity').html(state.selectedCoffeeShop.vicinity);
}


// init map
function initFinalMap() {
    insertBookAndCoffeeShopInfo();
    // var latitude = state.selectedCoffeeShop.geometry.location.lat;
    // var longitude = state.selectedCoffeeShop.geometry.location.lng;
    // var focus = { lat: latitude, lng: longitude };
    // var focus = {lat: 47.708346, lng: -122.181258};
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var map = new google.maps.Map(document.getElementById('final-map'), {
        zoom: 14,
        center: state.selectedCoffeeShop.geometry.location
    });

    marker = new google.maps.Marker({
        map: map,
        position: state.selectedCoffeeShop.geometry.location
    });

    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('text-directions-panel'));

    var onChangeHandler = function () {
        calculateAndDisplayRoute(directionsService, directionsDisplay);
    };

    function getDirectionsOnLoad() {
        calculateAndDisplayRoute(directionsService, directionsDisplay);
    };

    document.getElementById('start').addEventListener('change', onChangeHandler);
    document.getElementById('end').addEventListener('change', onChangeHandler);
    document.getElementById('finalBtn').addEventListener('click', onChangeHandler);

    if (state.userLat) {
        $('#start').val("your current location").attr("disabled", true);
        let lat = state.userLat;
        let lng = state.userLng;
        // let latLng = new google.maps.LatLng(lat, lng)
        state.userLoc = { lat: state.userLat, lng: state.userLng };
        console.log("userLoc", state.userLoc);
        getDirectionsOnLoad();
    }
    else {
        state.userLoc = document.getElementById('start').value;
    }

    $('#end').val(state.selectedCoffeeShop.name)
}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    directionsService.route({
        origin: state.userLoc,
        destination: state.selectedCoffeeShop.formatted_address,
        travelMode: 'DRIVING'
    }, function (response, status) {
        if (status === 'OK') {
            directionsDisplay.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}