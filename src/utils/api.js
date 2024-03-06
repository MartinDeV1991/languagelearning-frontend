import { toast } from "react-toastify";

// Define API base URL
const BASE_URL = process.env.REACT_APP_PATH;

// Common headers, if any, can be defined here
const headers = {
	"Content-Type": "application/json",
	Authorization: localStorage.getItem("languagelearning_token"),
	userId: localStorage.getItem("languagelearning_id"),
};

const setHeaders = () => {
	headers.Authorization = localStorage.getItem("languagelearning_token");
	headers.userId = localStorage.getItem("languagelearning_id");
};

// GET requests (they provide own error handling and toast)
export const fetchData = async (endpoint) => {
	setHeaders();
	try {
		const response = await fetch(`${BASE_URL}/${endpoint}`, { headers });
		if (!response.ok)
			throw new Error("Network response was not ok: " + response.status);
		const json = await response.json();
		return json;
	} catch (error) {
		toast.error(
			"There was an error fetching data. Please refresh the page and try again."
		);
		console.error("There was a problem with your fetch operation:", error);
	}
};

// POST requests (throws errors that need to be handled)
export const postData = async (endpoint, data) => {
	setHeaders();
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
	setHeaders();
	console.log(endpoint, "data= " + data);
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
		return response.json();
	} catch (error) {
		console.error("There was a problem with your put operation:", error);
		throw error;
	}
};

// DELETE requests (one id)
export const deleteOne = async (endpoint, id) => {
	setHeaders();
	try {
		const response = await fetch(`${BASE_URL}/${endpoint}/${id}`, {
			method: "DELETE",
			headers,
		});

		if (!response.ok) {
			console.log(response);
			throw new Error("Network response was not ok: " + response.status);
		}
		return response.json();
	} catch (error) {
		console.error("There was a problem with your delete operation:", error);
		throw error;
	}
};

// DELETE requests (give array of ids)
export const deleteMultiple = async (endpoint, arrayOfIds) => {
	setHeaders();
	try {
		const response = await fetch(`${BASE_URL}/${endpoint}`, {
			method: "DELETE",
			headers,
			body: JSON.stringify(arrayOfIds),
		});

		if (!response.ok) {
			console.log(response);
			throw new Error("Network response was not ok: " + response.status);
		}
		return response.json();
	} catch (error) {
		console.error("There was a problem with your delete operation:", error);
		throw error;
	}
};

export const uploadFile = async (endpoint, file) => {
	setHeaders();
	const formData = new FormData();
	formData.append("file", file);

	try {
		const response = await fetch(`${BASE_URL}/${endpoint}`, {
			method: "POST",
			body: formData,
		});

		if (!response.ok) {
			console.log(response);
			throw new Error("Network response was not ok: " + response.status);
		}
		return response;
	} catch (error) {
		console.error("There was a problem in uploadFile: ", error);
		throw error;
	}
};
