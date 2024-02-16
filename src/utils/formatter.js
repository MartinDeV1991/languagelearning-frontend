export const flagFormatter = (params) => {
	if (params.value != null) {
		// if null, don't return anything
		if (
			params.value.toUpperCase() === "EN-GB" ||
			params.value.toUpperCase() === "EN"
		) {
			// this doesn't return the right flag so it's hard coded
			return "🇬🇧";
		}
		const codePoints = params.value
			.toUpperCase()
			.split("")
			.map((char) => 127397 + char.charCodeAt());
		return String.fromCodePoint(...codePoints);
	}
};

export const bookFormatter = (params) => {
	if (params.value) {
		return `${params.value.title} (${params.value.author})`;
	}
	return "N/A";
};
