// console.log("selected coffee shop", state.selectedCoffeeShop);
// console.log("selected book", state.selectedBook);

function insertBookAndCoffeeShopInfo() {
    $('.selected-book-name').html(state.selectedBook.volumeInfo.title);
    $('.selected-book-url').html(`<a href="${state.selectedBook.saleInfo.buyLink}" target="_blank">https://play.google.com/store/books/</a> <img src="img/extLink.png" id="external-link-img"/>`);
    $('.selected-coffee-shop-name').html(state.selectedCoffeeShop.name);
    $('.selected-coffee-shop-vicinity').html(state.selectedCoffeeShop.vicinity);
}

// init map
function initFinalMap() {
    insertBookAndCoffeeShopInfo();
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var map = new google.maps.Map(document.getElementById('final-map'), {
        zoom: 14,
        center: state.selectedCoffeeShop.geometry.location
    });

    marker = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        title: state.selectedCoffeeShop.name,
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

    if (state.userLoc) {
        $('#start').val("your current location").attr("disabled", true);
        console.log("userLoc1", state.userLoc);
        getDirectionsOnLoad();
    }

    document.getElementById('start').addEventListener('change', onChangeHandler);
    document.getElementById('end').addEventListener('change', onChangeHandler);
    document.getElementById('finalBtn').addEventListener('click', onChangeHandler);

    $('#travel-mode').change(function () {
        calculateAndDisplayRoute(directionsService, directionsDisplay);
    })

    $('#end').val(state.selectedCoffeeShop.name)
}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {

    if (!state.userLoc) {
        state.userLoc = $('#start').val();
    }

    console.log("userLoc2", state.userLoc);
    var selectedTravelMode = $('#travel-mode option:selected').text();
    directionsService.route({
        origin: state.userLoc,
        destination: state.selectedCoffeeShopAddress,
        travelMode: google.maps.TravelMode[selectedTravelMode]
    }, function (response, status) {
        if (status === 'OK') {
            directionsDisplay.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
            state.userLoc = "";
            $('#start').attr("disabled", false).val('');
        }
    });
}