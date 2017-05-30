var state;

if (localStorage.state) {
    state = JSON.parse(localStorage.state);
}

else {
    state = {};
}