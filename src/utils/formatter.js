export const flagFormatter = (params) => {
	if (params.value != null) {
		// if null, don't return anything
		if (params.value === "EN-GB") {
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
