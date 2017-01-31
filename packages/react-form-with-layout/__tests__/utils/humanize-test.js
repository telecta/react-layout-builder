jest.unmock('../../src/utils/humanize')

describe('humanize', function() {
    var humanize;

    beforeEach(function(){
        humanize = require('../../src/utils/humanize');
    });

    it('should capitalize and remove _ ', function(){
        var input = 'hello_world_';
        expect(humanize(input)).toBe('Hello world ');
    });

    it('should handle null', function(){
        expect(humanize(null)).toBeNull();
    });
});
