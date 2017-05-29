

// get book data
function getData(search, callback) {
    var base_url = "https://www.googleapis.com/books/v1/volumes?";
    var query = {
        apiKey: 'AIzaSyBZw_Dg7LohwJhi_O7ZOOz--qFthIyVlFM',
        q: search,
        filter: 'ebooks',
        maxResults: 6,
        orderBy: 'relevance'
    }
    console.log(query);
    $.getJSON(base_url, query, callback);
}


// display search results
function displayData(data) {
    var results = "";

    if (data.items) {
        data.items.map(function (book) {
            results += `<div><span>${book.volumeInfo.title}</span><br />
        <span>${book.volumeInfo.authors}</span><br />
        <a href="${book.volumeInfo.canonicalVolumeLink}" target="_blank">external link to book</a><br />
        <span>${book.saleInfo.saleability}</span><br />
        <img src="${book.volumeInfo.imageLinks.thumbnail}" />
        </div>`;
        })
    }
    else {
        results += "<p>no results</p>";
    }

    $('#book-results').html(results);
}


// listen for form submit
$('#book-search').submit(function (event) {
    event.preventDefault();
    var userInput = $('form input').val();
    getData(userInput, displayData);
})