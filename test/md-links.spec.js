const { determineIfLineHasLink } = require("..");

test('determines if a string has link', () => {
    expect(getLinkFromLine("[link](https://google.com)")).toBe('[link](https://google.com)');
    expect(getLinkFromLine("[link] https://google.com)")).toBe(null);
    expect(getLinkFromLine("[link] (https://google.com)")).toBe(null);
});