jest.unmock('../../src/utils/humanize');

describe('humanize', function() {
    var humanize;

    beforeEach(() => {
        humanize = require('../../src/utils/humanize');
    });

    it('should capitalize and remove _ ', () => {
        var input = 'hello_world_';
        expect(humanize(input)).toBe('Hello world ');
    });

    it('should handle null', () => {
        expect(humanize(null)).toBeNull();
    });
});
