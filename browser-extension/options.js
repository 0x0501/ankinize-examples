const form = document.getElementById("form");

chrome.storage.local.get().then((saved) => {
  for (const [name, value] of Object.entries(saved)) {
    if (form.elements[name]) form.elements[name].value = value;
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(form));
  // A server of your own needs its origin granted once; ankinize.com already is.
  const origin = `${new URL(values.baseUrl).origin}/*`;
  if (origin !== "https://ankinize.com/*") {
    const granted = await chrome.permissions.request({ origins: [origin] });
    if (!granted) return;
  }
  await chrome.storage.local.set(values);
});
