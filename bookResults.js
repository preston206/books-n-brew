

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
    console.log(query);
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
        <button type="button" id="bookSelect">select</button><br />
        <img src="${book.volumeInfo.imageLinks.thumbnail}" />
        </div><br />`);

            html.find('#bookSelect').click(function (event) {

                state.selectedBook = book;
                localStorage.state = JSON.stringify(state);
                console.log("selected book", state.selectedBook);
            })
            results.push(html);
        })
    }

    else {
        let msg = $(`<p>no results</p>`);
        results.push(msg);
    }

    state.books = data.items;
    localStorage.state = JSON.stringify(state);

    $('#book-results').html(results);
}


// listen for form submit
$('#book-search').submit(function (event) {
    event.preventDefault();
    var userInput = $('form input').val();
    state.bookSearchInput = userInput;
    getData(userInput, displayData);
})

$(function () {
    if (state.books) {
        displayData({ items: state.books })
        $('form input').val(state.bookSearchInput);
    }
})