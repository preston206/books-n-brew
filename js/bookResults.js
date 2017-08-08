
// get book data
function getData(search, callback) {
    var base_url = "https://www.googleapis.com/books/v1/volumes?";
    var query = {
        apiKey: 'AIzaSyBZw_Dg7LohwJhi_O7ZOOz--qFthIyVlFM',
        q: search,
        filter: 'paid-ebooks',
        showPreorders: false,
        maxResults: 7,
        orderBy: 'relevance'
    }

    $.getJSON(base_url, query, callback);
}

// display book search results
function displayData(data) {
    var results = [];

    if (data.items) {

        data.items.map(function (book) {

            if ((book.volumeInfo.title) && (book.volumeInfo.authors) && (book.volumeInfo.imageLinks) && (book.saleInfo.retailPrice) && (book.searchInfo) && (book.searchInfo.textSnippet)) {

                let bookRetailAmount = book.saleInfo.retailPrice.amount;
                let priceRounded = Math.round(bookRetailAmount);

                let html = $(`<div class="book-info"><div class="book-title-author-wrap">
                <span class="book-title">${book.volumeInfo.title}</span><br />
        <span class="book-author">by ${book.volumeInfo.authors[0]}</span></div>
        <span>$${priceRounded} ${book.saleInfo.retailPrice.currencyCode}</span><br />
        <span class="book-description-snippet">" ${book.searchInfo.textSnippet} "</span>
        <div class="book-image"><img src="${book.volumeInfo.imageLinks.thumbnail}" /></div>
        <button type="button" class="select-book btn btn-primary btn-sm">select</button>
        </div><br />`);

                html.find('.select-book').click(function (event) {
                    state.selectedBook = book;
                    // localStorage.state = JSON.stringify(state);
                    $('.find-book-page').addClass('hide');
                    $('.find-coffee-shop-page').removeClass('hide-map');
                    $('body').addClass('coffee-bg');
                    headerState(2);
                    getLoc();

                })
                results.push(html);
            }
        })
    }

    else {
        let msg = $(`<p>We couldn't find any books. Please alter your search and try again.</p>`);
        results.push(msg);
    }

    state.books = data.items;
    // localStorage.state = JSON.stringify(state);
    $('.book-results').html(results);
}

// listen for form submit
$('#book-search-form').submit(function (event) {
    event.preventDefault();
    var userInput = $('#book-input').val();
    state.bookSearchInput = userInput;

    // display tagline
    $('#book-select-tagline').removeClass('hidden-tagline');
    getData(userInput, displayData);
})

$(function () {
    if (state.books) {
        displayData({ items: state.books })
    }
})