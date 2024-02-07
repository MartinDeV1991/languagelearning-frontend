import { toast } from "react-toastify";

// Define API base URL
const BASE_URL = "http://localhost:8080";
// const BASE_URL = "https://language-backend.azurewebsites.net/";

// Common headers, if any, can be defined here
const headers = {
	"Content-Type": "application/json",
	// Include other headers like authorization if needed
};

// GET requests (they provide own error handling and toast)
export const fetchData = async (endpoint) => {
	try {
		const response = await fetch(`${BASE_URL}/${endpoint}`, { headers });
		if (!response.ok)
			throw new Error("Network response was not ok: " + response.status);
		const json = await response.json();
		return json;
	} catch (error) {
		toast.error("There was an error fetching data. Please refresh the page.");
		console.error("There was a problem with your fetch operation:", error);
	}
};

// POST requests (throws errors that need to be handled)
export const postData = async (endpoint, data) => {
	try {
		const response = await fetch(`${BASE_URL}/${endpoint}`, {
			method: "POST",
			headers,
			body: JSON.stringify(data),
		});
		if (!response.ok)
			throw new Error("Network response was not ok: " + response.status);
		return await response.json();
	} catch (error) {
		console.error("There was a problem with your post operation:", error);
		throw error;
	}
};

// PUT requests (throws errors that need to be handled)
export const putData = async (endpoint, data = null) => {
	try {
		const fetchOptions = {
			method: "PUT",
			headers,
		};

		// Only add the body if data is provided
		if (data !== null) {
			fetchOptions.body = JSON.stringify(data);
		}

		const response = await fetch(`${BASE_URL}/${endpoint}`, fetchOptions);

		if (!response.ok) {
			console.log(response);
			throw new Error("Network response was not ok: " + response.status);
		}
		return await response.json();
	} catch (error) {
		console.error("There was a problem with your put operation:", error);
		throw error;
	}
};

// DELETE requests (give array of ids)
export const deleteData = async (endpoint, arrayOfIds) => {
	try {
		const responses = Promise.all(
			arrayOfIds.map((id) =>
				fetch(`${BASE_URL}/${endpoint}/${id}`, {
					method: "DELETE",
					headers,
				})
			)
		);
		return await responses;
	} catch (error) {
		console.error("There was a problem with your delete operation:", error);
		throw error;
	}
};
