

// TODO: remove URL link from book search results


// get book data
function getData(search, callback) {
    var base_url = "https://www.googleapis.com/books/v1/volumes?";
    var query = {
        apiKey: 'AIzaSyBZw_Dg7LohwJhi_O7ZOOz--qFthIyVlFM',
        q: search,
        filter: 'ebooks',
        maxResults: 7,
        orderBy: 'relevance'
    }
    console.log("query string", query);
    $.getJSON(base_url, query, callback);
}


// display search results
function displayData(data) {
    var results = [];

    if (data.items) {
        data.items.map(function (book) {
            let html = $(`<div><span>${book.volumeInfo.title}</span><br />
        <span>${book.volumeInfo.authors}</span><br />
        <a href="${book.volumeInfo.canonicalVolumeLink}" target="_blank">external link to book</a><br />
        <span>${book.saleInfo.saleability}</span><br />
        <button type="button" id="select-book">select</button><br />
        <img src="${book.volumeInfo.imageLinks.thumbnail}" />
        </div><br />`);

            html.find('#select-book').click(function (event) {
                state.selectedBook = book;
                // localStorage.state = JSON.stringify(state);
                $('.find-book-page').addClass('hide');
                $('.find-coffee-shop-page').removeClass('hide-map');
                headerState(2);
                // initMap();
                getLoc();
                console.log("state.selectedBook", state.selectedBook);
            })
            results.push(html);
        })
    }

    else {
        let msg = $(`<p>no results</p>`);
        results.push(msg);
    }

    state.books = data.items;
    // localStorage.state = JSON.stringify(state);
    // console.log("state.books", state.books);
    $('.book-results').html(results);
}


// listen for form submit
$('#book-search-form').submit(function (event) {
    event.preventDefault();
    var userInput = $('#book-input').val();
    state.bookSearchInput = userInput;

    // display tagline
    $('.book-search-tagline').show();
    getData(userInput, displayData);
})

$(function () {
    if (state.books) {
        displayData({ items: state.books })
        // $('form input').val(state.bookSearchInput);
    }
})