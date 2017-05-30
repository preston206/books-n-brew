console.log("selected coffee shop", state.selectedCoffeeShop);
console.log(state.selectedCoffeeShop.formatted_address);
console.log("selected book", state.selectedBook);

insertBookAndCoffeeShopInfo();

function initMap() {
    var latitude = state.selectedCoffeeShop.geometry.location.lat;
    var longitude = state.selectedCoffeeShop.geometry.location.lng;
    var focus = { lat: latitude, lng: longitude };
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: focus
    });

    marker = new google.maps.Marker({
        map: map,
        position: focus
    });

    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('text-directions'));

    var onChangeHandler = function () {
        calculateAndDisplayRoute(directionsService, directionsDisplay);
    };
    document.getElementById('start').addEventListener('change', onChangeHandler);
    document.getElementById('end').addEventListener('change', onChangeHandler);

    $('#end').val(state.selectedCoffeeShop.name)
}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    directionsService.route({
        origin: document.getElementById('start').value,
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

function insertBookAndCoffeeShopInfo() {
    $('.final-book-name').html(state.selectedBook.volumeInfo.title);
    $('.final-book-url').html(`<a href="${state.selectedBook.saleInfo.buyLink}" target="_blank">https://play.google.com/store/books/</a>`);
    $('.final-coffee-shop-name').html(state.selectedCoffeeShop.name);
    $('.final-coffee-shop-vicinity').html(state.selectedCoffeeShop.vicinity);
}