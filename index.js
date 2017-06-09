
// app state
var state;

// state = {
//     books: [],
//     selectedBook: {
//         saleInfo: {
//             buyLink: ""
//         },
//         volumeInfo: {
//             title: ""
//         }
//     },
//     bookSearchInput: "",
//     selectedCoffeeShop: {
//         name: "",
//         vicinity: ""
//     }
// };

// state = {
//     books: [],
//     selectedBook: {
//         saleInfo: {
//             buyLink: ""
//         },
//         volumeInfo: {
//             title: ""
//         }
//     },
//     bookSearchInput: "",

// };

state = {
    count: null,
};

// function headerState() {
//     $('.step-1').addClass('active');
//     $('.step-2').addClass('in-active');
//     $('.step-3').addClass('in-active');
// }


// TODO: cleanup state; probably dont need state.count

function headerState(count) {
    // var count = state.count;
    // count = 1;
    switch (count) {
        case 1:
            $('.step-1').addClass('active');
            $('.step-2, .step-3').addClass('in-active');
            // count++;
            console.log("count", count);
            break;
        case 2:
            $('.step-1').removeClass("active");
            $('.step-1').addClass("in-active");
            $('.step-2').removeClass("in-active");
            $('.step-2').addClass("active");
            // count++;
            console.log("count", count);
            break;
        case 3:
            $('.step-2').removeClass("active");
            $('.step-2').addClass("in-active");
            $('.step-3').removeClass("in-active");
            $('.step-3').addClass("active");
            // count = 1;
            console.log("count", count);
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