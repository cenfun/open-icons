module.exports = {
    name: 'lawnicons',
    url: 'https://github.com/LawnchairLauncher/lawnicons',

    downloadUrl: 'https://github.com/LawnchairLauncher/lawnicons/archive/refs/heads/develop.zip',
    moduleEntry: 'lawnicons-develop',
    moduleFilters: 'svgs',

    license: ' Apache 2.0',

    dirs: 'svgs',

    onSVGName: function(name, item) {
        name = name.toLowerCase();
        name = name.replace(/_/g, '-');
        return this.onSVGNameDefault(name, item);
    },


    onSVGContent: function(content, item) {
        content = content.split('#000000').join('currentColor');
        content = content.split('#000').join('currentColor');
        content = content.split(':#000').join(':currentColor');

        content = content.split('#111111').join('currentColor');
        content = content.split('#1d1d1b').join('currentColor');

        if (item.name === 'schoolplanner') {
            content = content.split('fill:none').join('');
        }

        if (item.name === 'sparkasse') {
            content = content.split('url(#clipPath6670)').join('');
            content = content.split('stroke-width:6.35;').join('');
        }

        return content;
    },

    onSVGDocument: function($svg, item, $) {

        let found = false;
        ['path', 'g', 'rect', 'circle', 'ellipse'].forEach(function(k) {
            $svg.find(k).each(function(i, n) {
                const $elem = $(n);
                let fill = $elem.attr('fill');
                if (fill && fill !== 'none') {
                    fill = 'currentColor';
                    $elem.attr('fill', fill);
                    found = true;
                }
                const stroke = $elem.attr('stroke');
                if (stroke && stroke !== 'none') {
                    $elem.attr('stroke', 'currentColor');
                    if (fill === 'currentColor') {
                        $elem.attr('fill', 'none');
                    }
                    found = true;
                }
            });

        });

        (function() {
            if (item.name === 'kiwi-browser') {
                $svg.find('circle').attr('fill', 'currentColor');
                return;
            }
            if (['microg-settings', 'androtainer'].includes(item.name)) {
                $svg.find('path').each(function(i, n) {
                    const $elem = $(n);
                    if (!$elem.attr('fill')) {
                        $elem.attr('fill', 'currentColor');
                    }
                });
            }
        })();


        if (found) {
            return;
        }


        let fill = $svg.attr('fill');
        if (fill && fill !== 'none') {
            fill = 'currentColor';
            $svg.attr('fill', fill);
        }

        const stroke = $svg.attr('stroke');
        if (stroke && stroke !== 'none') {
            $svg.attr('stroke', 'currentColor');
            if (fill === 'currentColor') {
                $svg.attr('fill', 'none');
            }
        } else {
            $svg.attr('fill', 'currentColor');
        }

    }


};
