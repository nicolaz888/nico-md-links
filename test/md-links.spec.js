const { determineIfLineHasLink } = require("..");

test('determines if a string has link', () => {
    expect(determineIfLineHasLink("[link](https://google.com)")).toBe('[link](https://google.com)');
    expect(determineIfLineHasLink("[link] https://google.com)")).toBe(null);
    expect(determineIfLineHasLink("[link] (https://google.com)")).toBe(null);
});