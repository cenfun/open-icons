
const decompress = require('lz-utils/lib/decompress.js');
const fileStats = {
    'akar': {
        'size': 198549,
        'sizeLZ': 76978
    },
    'ant': {
        'size': 467628,
        'sizeLZ': 199610
    },
    'awesome': {
        'size': 1087596,
        'sizeLZ': 476334
    },
    'blueprint': {
        'size': 327529,
        'sizeLZ': 128418
    },
    'bootstrap': {
        'size': 1120862,
        'sizeLZ': 400010
    },
    'box': {
        'size': 821591,
        'sizeLZ': 316962
    },
    'carbon': {
        'size': 962939,
        'sizeLZ': 336938
    },
    'charm': {
        'size': 89316,
        'sizeLZ': 21510
    },
    'coreui': {
        'size': 339809,
        'sizeLZ': 140382
    },
    'crypto': {
        'size': 676914,
        'sizeLZ': 338030
    },
    'cssgg': {
        'size': 298861,
        'sizeLZ': 85858
    },
    'dev': {
        'size': 406096,
        'sizeLZ': 220242
    },
    'element': {
        'size': 165952,
        'sizeLZ': 67598
    },
    'entypo': {
        'size': 256804,
        'sizeLZ': 116830
    },
    'eva': {
        'size': 224222,
        'sizeLZ': 72350
    },
    'feather': {
        'size': 100117,
        'sizeLZ': 25122
    },
    'flag': {
        'size': 235267,
        'sizeLZ': 98626
    },
    'flat': {
        'size': 212896,
        'sizeLZ': 86014
    },
    'fluent': {
        'size': 2471690,
        'sizeLZ': 763378
    },
    'foundation': {
        'size': 293756,
        'sizeLZ': 146422
    },
    'grommet': {
        'size': 276959,
        'sizeLZ': 114614
    },
    'hero': {
        'size': 191615,
        'sizeLZ': 56014
    },
    'icomoon': {
        'size': 254687,
        'sizeLZ': 113014
    },
    'iconoir': {
        'size': 574867,
        'sizeLZ': 144214
    },
    'ikonate': {
        'size': 97419,
        'sizeLZ': 26218
    },
    'ionic': {
        'size': 635190,
        'sizeLZ': 247946
    },
    'jam': {
        'size': 534156,
        'sizeLZ': 191426
    },
    'line': {
        'size': 1119330,
        'sizeLZ': 518798
    },
    'lucide': {
        'size': 308331,
        'sizeLZ': 71186
    },
    'majest': {
        'size': 375452,
        'sizeLZ': 109822
    },
    'maki': {
        'size': 112721,
        'sizeLZ': 51814
    },
    'material': {
        'size': 1616927,
        'sizeLZ': 525002
    },
    'mdi': {
        'size': 3238412,
        'sizeLZ': 1101434
    },
    'mono': {
        'size': 83635,
        'sizeLZ': 30562
    },
    'oct': {
        'size': 342456,
        'sizeLZ': 128702
    },
    'park': {
        'size': 1467362,
        'sizeLZ': 350030
    },
    'phosphor': {
        'size': 2902455,
        'sizeLZ': 912982
    },
    'pixelart': {
        'size': 137777,
        'sizeLZ': 34242
    },
    'prime': {
        'size': 130778,
        'sizeLZ': 46634
    },
    'radix': {
        'size': 209408,
        'sizeLZ': 76470
    },
    'remix': {
        'size': 1026667,
        'sizeLZ': 319194
    },
    'simple': {
        'size': 3940987,
        'sizeLZ': 1959670
    },
    'tabler': {
        'size': 966046,
        'sizeLZ': 198250
    },
    'teeny': {
        'size': 582021,
        'sizeLZ': 196078
    },
    'tiny': {
        'size': 169012,
        'sizeLZ': 79018
    },
    'typ': {
        'size': 226048,
        'sizeLZ': 104722
    },
    'uiw': {
        'size': 166777,
        'sizeLZ': 82062
    },
    'unicons': {
        'size': 804377,
        'sizeLZ': 265982
    },
    'vscode': {
        'size': 252096,
        'sizeLZ': 113098
    },
    'weather': {
        'size': 311695,
        'sizeLZ': 139190
    },
    'zond': {
        'size': 86056,
        'sizeLZ': 27378
    }
};
module.exports = [
    require('../output/web-icons-akar.lz.js'),
    require('../output/web-icons-ant.lz.js'),
    require('../output/web-icons-awesome.lz.js'),
    require('../output/web-icons-blueprint.lz.js'),
    require('../output/web-icons-bootstrap.lz.js'),
    require('../output/web-icons-box.lz.js'),
    require('../output/web-icons-carbon.lz.js'),
    require('../output/web-icons-charm.lz.js'),
    require('../output/web-icons-coreui.lz.js'),
    require('../output/web-icons-crypto.lz.js'),
    require('../output/web-icons-cssgg.lz.js'),
    require('../output/web-icons-dev.lz.js'),
    require('../output/web-icons-element.lz.js'),
    require('../output/web-icons-entypo.lz.js'),
    require('../output/web-icons-eva.lz.js'),
    require('../output/web-icons-feather.lz.js'),
    require('../output/web-icons-flag.lz.js'),
    require('../output/web-icons-flat.lz.js'),
    require('../output/web-icons-fluent.lz.js'),
    require('../output/web-icons-foundation.lz.js'),
    require('../output/web-icons-grommet.lz.js'),
    require('../output/web-icons-hero.lz.js'),
    require('../output/web-icons-icomoon.lz.js'),
    require('../output/web-icons-iconoir.lz.js'),
    require('../output/web-icons-ikonate.lz.js'),
    require('../output/web-icons-ionic.lz.js'),
    require('../output/web-icons-jam.lz.js'),
    require('../output/web-icons-line.lz.js'),
    require('../output/web-icons-lucide.lz.js'),
    require('../output/web-icons-majest.lz.js'),
    require('../output/web-icons-maki.lz.js'),
    require('../output/web-icons-material.lz.js'),
    require('../output/web-icons-mdi.lz.js'),
    require('../output/web-icons-mono.lz.js'),
    require('../output/web-icons-oct.lz.js'),
    require('../output/web-icons-park.lz.js'),
    require('../output/web-icons-phosphor.lz.js'),
    require('../output/web-icons-pixelart.lz.js'),
    require('../output/web-icons-prime.lz.js'),
    require('../output/web-icons-radix.lz.js'),
    require('../output/web-icons-remix.lz.js'),
    require('../output/web-icons-simple.lz.js'),
    require('../output/web-icons-tabler.lz.js'),
    require('../output/web-icons-teeny.lz.js'),
    require('../output/web-icons-tiny.lz.js'),
    require('../output/web-icons-typ.lz.js'),
    require('../output/web-icons-uiw.lz.js'),
    require('../output/web-icons-unicons.lz.js'),
    require('../output/web-icons-vscode.lz.js'),
    require('../output/web-icons-weather.lz.js'),
    require('../output/web-icons-zond.lz.js')
].map((item) => {
    item = decompress(item);
    return {
        ... item,
        ... fileStats[item.name]
    };
});
