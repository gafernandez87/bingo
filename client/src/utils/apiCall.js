const mock = false;
// const mock = true;

export default function apiCall(url, options) {
  if (mock) {
    if (url.includes("/api/rooms/")) {
      return new Promise((resolve) => {
        resolve({
          players: [
            {
              _id: "5ecc385dee183317c9439717",
              name: "Gaston",
              taken: false,
              __v: 0,
            },
            {
              _id: "5ecc385fee183317c9439719",
              name: "Anto",
              taken: true,
              __v: 0,
            },
          ],
          _id: "5ecc32e73b62fa14c509b600",
          name: "Test",
          __v: 2,
        });
      });
    }
  }

  return fetch(url, {
    ...options,
    method: (options && options.method) || "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  }).then((response) => handleErrors(response));
}

function handleErrors(response) {
  if (!response.ok) {
    console.log(response);
    throw Error(response.statusText);
  }
  return response.json();
}
