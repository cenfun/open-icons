
import decompress from 'lz-utils/lib/decompress.js';
import akar from '../output/web-icons-akar.lz.js';
import ant from '../output/web-icons-ant.lz.js';
import awesome from '../output/web-icons-awesome.lz.js';
import blueprint from '../output/web-icons-blueprint.lz.js';
import bootstrap from '../output/web-icons-bootstrap.lz.js';
import box from '../output/web-icons-box.lz.js';
import carbon from '../output/web-icons-carbon.lz.js';
import charm from '../output/web-icons-charm.lz.js';
import coreui from '../output/web-icons-coreui.lz.js';
import crypto from '../output/web-icons-crypto.lz.js';
import cssgg from '../output/web-icons-cssgg.lz.js';
import dev from '../output/web-icons-dev.lz.js';
import element from '../output/web-icons-element.lz.js';
import entypo from '../output/web-icons-entypo.lz.js';
import eva from '../output/web-icons-eva.lz.js';
import feather from '../output/web-icons-feather.lz.js';
import flag from '../output/web-icons-flag.lz.js';
import flat from '../output/web-icons-flat.lz.js';
import fluent from '../output/web-icons-fluent.lz.js';
import foundation from '../output/web-icons-foundation.lz.js';
import grommet from '../output/web-icons-grommet.lz.js';
import hero from '../output/web-icons-hero.lz.js';
import icomoon from '../output/web-icons-icomoon.lz.js';
import iconoir from '../output/web-icons-iconoir.lz.js';
import ikonate from '../output/web-icons-ikonate.lz.js';
import ionic from '../output/web-icons-ionic.lz.js';
import jam from '../output/web-icons-jam.lz.js';
import line from '../output/web-icons-line.lz.js';
import lucide from '../output/web-icons-lucide.lz.js';
import majest from '../output/web-icons-majest.lz.js';
import maki from '../output/web-icons-maki.lz.js';
import material from '../output/web-icons-material.lz.js';
import mdi from '../output/web-icons-mdi.lz.js';
import mono from '../output/web-icons-mono.lz.js';
import oct from '../output/web-icons-oct.lz.js';
import park from '../output/web-icons-park.lz.js';
import phosphor from '../output/web-icons-phosphor.lz.js';
import pixelart from '../output/web-icons-pixelart.lz.js';
import prime from '../output/web-icons-prime.lz.js';
import radix from '../output/web-icons-radix.lz.js';
import remix from '../output/web-icons-remix.lz.js';
import simple from '../output/web-icons-simple.lz.js';
import tabler from '../output/web-icons-tabler.lz.js';
import teeny from '../output/web-icons-teeny.lz.js';
import tiny from '../output/web-icons-tiny.lz.js';
import typ from '../output/web-icons-typ.lz.js';
import uiw from '../output/web-icons-uiw.lz.js';
import unicons from '../output/web-icons-unicons.lz.js';
import vscode from '../output/web-icons-vscode.lz.js';
import weather from '../output/web-icons-weather.lz.js';
import zond from '../output/web-icons-zond.lz.js';
const iconContents = {
    akar,
    ant,
    awesome,
    blueprint,
    bootstrap,
    box,
    carbon,
    charm,
    coreui,
    crypto,
    cssgg,
    dev,
    element,
    entypo,
    eva,
    feather,
    flag,
    flat,
    fluent,
    foundation,
    grommet,
    hero,
    icomoon,
    iconoir,
    ikonate,
    ionic,
    jam,
    line,
    lucide,
    majest,
    maki,
    material,
    mdi,
    mono,
    oct,
    park,
    phosphor,
    pixelart,
    prime,
    radix,
    remix,
    simple,
    tabler,
    teeny,
    tiny,
    typ,
    uiw,
    unicons,
    vscode,
    weather,
    zond
};
const iconStats = {
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
const iconList = Object.keys(iconStats);
const iconTotal = iconList.length;

const webIcons = iconList.map((k) => {
    return {
        name: k, ... iconStats[k]
    };
});

webIcons.decompress = (callback) => {
    return iconList.map((k, i) => {
        const item = JSON.parse(decompress(iconContents[k]));
        if (typeof callback === 'function') {
            callback(k, i, iconTotal);
        }
        return Object.assign(item, iconStats[k]);
    });
};

export default webIcons;
