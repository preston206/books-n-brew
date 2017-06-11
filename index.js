
var state;

state = {
    books: [],
    selectedBook: {
        saleInfo: {
            buyLink: ""
        },
        volumeInfo: {
            title: ""
        }
    },
    bookSearchInput: "",
    selectedCoffeeShop: {
        formatted_address: "",
        name: "",
        vicinity: ""
    },
    selectedCoffeeShopAddress: ""
};

function headerState(count) {
    switch (count) {
        case 1:
            $('.step-1').addClass('active');
            $('.step-2, .step-3').addClass('in-active');
            break;
        case 2:
            $('.step-1').removeClass("active");
            $('.step-1').addClass("in-active");
            $('.step-2').removeClass("in-active");
            $('.step-2').addClass("active");
            break;
        case 3:
            $('.step-2').removeClass("active");
            $('.step-2').addClass("in-active");
            $('.step-3').removeClass("in-active");
            $('.step-3').addClass("active");
            break;
        default:
            console.log("unexpected case value");
            break;
    }
}

function goToBooks() {
    $('.landing-page').addClass('hide');
    $('.find-book-page').removeClass('hide');
    headerState(1);
}