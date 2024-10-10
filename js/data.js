let data = {
	view: '',
	search: [],
	id: 1
};

// Save data to local storage before the window unloads
window.addEventListener('beforeunload', function () {
	localStorage.setItem('javascript-local-storage', JSON.stringify(data));
});

// Retrieve data from local storage if it exists
if (localStorage.getItem('javascript-local-storage') !== null) {
	data = JSON.parse(localStorage.getItem('javascript-local-storage'));
}