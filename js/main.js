const $form = document.querySelector("form");
const $input = document.querySelector("input");
const $main = document.querySelector("main");
const $section = document.querySelector("section");
const $grid = document.querySelector('.grid');


$form.addEventListener("submit", handleSubmit);

function handleSubmit(event) {
	event.preventDefault();

	const inputValue = $input.value.trim();

	if (inputValue === '') {
		return;
	}

	if (typeof data === 'undefined') {
		console.error("Data object is not defined.");
		return;
	}

	let obj = {
		keyword: inputValue,
		id: data.id,
	};

	data.id++;
	data.search.unshift(obj);
	fetchArtwork(data.search[0].keyword);

	$form.reset();
}

function fetchArtwork(keyword) {
	const url = `https://api.harvardartmuseums.org/object?keyword=${encodeURIComponent(keyword)}&primaryimageurl:*&hasimage=1&q=imagepermissionlevel:0ORimagepermissionlevel:1&size=100&fields=primaryimageurl,title,dated,people,culture,url&sort=random&apikey=8c10f88a-3252-4db8-b69c-a317f6353025`;

	fetch(url)
		.then(response => {
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			return response.json();
		})
		.then(data => processResponse(data))
		.catch(error => {
			console.error('Error fetching data:', error);
		});
}

function processResponse(response) {
	clearSection();

	if (response.records.length === 0) {
		showWarning();
		return;
	}

	response.records.forEach(record => {
		if (record.people && record.people.length > 0) {
			artwork(record);
		}
	});

  updateUIState();
}

function clearSection() {
	if ($section.hasChildNodes()) {
		$section.innerHTML = "";
		document.querySelector(".quote").classList.add("hidden");
	}
}

function showWarning() {
	document.querySelector(".quote").classList.add("hidden");
	document.querySelector(".warning").classList.remove("hidden");
}

function updateUIState() {
	const elements = {
		main: document.querySelector("main"),
		header: document.querySelector("header"),
		quote: document.querySelector(".quote"),
		warning: document.querySelector(".warning")
	};

	elements.main.classList.remove("hidden");
	elements.header.classList.add("hidden");
	elements.warning.classList.add("hidden");
	elements.warning.classList.add("hidden");
}

function artwork(record) {
	const elements = {
		figure: document.createElement("figure"),
		source: document.createElement("a"),
		container: document.createElement('div'),
		image: document.createElement("img"),
		figcaption: document.createElement("figcaption"),
		title: document.createElement("span"),
		date: document.createElement("span"),
		break: document.createElement("br"),
		artist: document.createElement("span"),
		culture: document.createElement("span")
	};

	// Set classes
	Object.entries({
		image: "artwork",
		artist: "artist",
		culture: "culture",
		title: "title",
		date: "date"
	}).forEach(([key, className]) => elements[key].className = className);

	// Construct DOM
	$section.append(elements.figure);
	elements.figure.append(elements.source, elements.figcaption);
	elements.source.append(elements.image);
	elements.figcaption.append(
		elements.title,
		elements.date,
		elements.break,
		elements.artist,
		elements.culture
	);

	// Set attributes and content
	Object.assign(elements.source, {
		href: record.url,
		target: '_blank'
	});

	Object.assign(elements.image, {
		src: record.primaryimageurl,
		loading: 'lazy',
		onerror: () => elements.figure.style.display = "none"
	});

	elements.title.textContent = record.title || "Untitled";
	elements.date.textContent = record.dated || "Date not available";
	elements.artist.textContent = record.people?.[0]?.displayname || "Unknown Artist";
	elements.culture.textContent = record.people?.[0]?.culture || "Culture not specified";

	const altText = `${elements.title.textContent} (${elements.date.textContent}) by ${elements.artist.textContent} (${elements.culture.textContent}).`;
	elements.image.alt = altText;
	elements.image.title = altText;

	return elements.figure;
}

document.querySelector('.nav-index').addEventListener('click', (event) => {
  document.querySelector('section').classList.toggle('index');
  event.preventDefault();
});