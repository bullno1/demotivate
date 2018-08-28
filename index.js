const TTL = 2 * 60 * 1000; // 2 minute
const CACHE_KEY = 'cache-v1';
const URL = 'https://www.reddit.com/r/Demotivational.json?limit=100';
const ICON = '\ud83e\udd14';

function fetchDeomotivational() {
	const cacheStr = localStorage.getItem(CACHE_KEY);
	if(cacheStr) {
		const cache = JSON.parse(cacheStr);
		if(Date.now() < cache.expireAt) {
			return Promise.resolve(cache.data);
		}
	}

	return fetch(URL, {
		headers: { 'Accept': 'application/json' }
	})
	.then(response => response.json())
	.then(data => {
		localStorage.setItem(CACHE_KEY, JSON.stringify({
			data: data,
			expireAt: Date.now() + TTL
		}));
		return data;
	});
}

fetchDeomotivational()
.then(json => {
	const posts = json.data.children;
	const usablePosts = json.data.children.filter(post => post.data.post_hint === 'image' && !post.data.over_18);
	// https://stackoverflow.com/questions/5915096/get-random-item-from-javascript-array
	const chosenPost = usablePosts[Math.floor(Math.random() * usablePosts.length)];

	document.title = `${ICON} ${chosenPost.data.title} ${ICON}`;

	const img = document.createElement("img");
	img.src = chosenPost.data.url;
	document.body.appendChild(img);
});
