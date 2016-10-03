xdescribe('humanize', function() {
    var humanize;

    beforeEach(function(){
        humanize = require('utils/humanize');
    });

    it('should capitalize and remove _ ', function(){
        var input = 'hello_world_';
        expect(humanize(input)).toBe('Hello world ');
    });

    it('should handle null', function(){
        expect(humanize(null)).toBeNull();
    });
});
