
module.exports = {
    name: 'academicons',
    url: 'https://github.com/jpswalsh/academicons',

    moduleFilters: 'svg',
    dirs: 'svg',

    onSVGDocument: function($svg, item) {
        $svg.attr('fill', 'currentColor');

        if (['open-access', 'pubpeer'].includes(item.name)) {
            $svg.find('path').removeAttr('style');
        }

    }

};
