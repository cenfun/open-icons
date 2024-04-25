# open-icons
![](https://img.shields.io/npm/v/open-icons)
![](https://img.shields.io/librariesio/github/cenfun/open-icons)
![](https://img.shields.io/librariesio/dependents/npm/open-icons)
[![](https://badgen.net/npm/dw/open-icons)](https://www.npmjs.com/package/open-icons)

[https://cenfun.github.io/open-icons/](https://cenfun.github.io/open-icons/)


## Features
* Pure SVG icons 
* fill/stroke with currentColor
* High compressed bundle
* UMD format bundle
* Web components
* Customize size/color/BG/radius
* kebab-case naming

## Installation
```sh
npm install open-icons
```

## Usage
```js
import { decompress } from 'open-icons';
import awesome from "open-icons/dist/open-icons-awesome.js";
const awesomePkg = JSON.parse(decompress(awesome));
console.log(awesomePkg);
```

# {placeholder_info}
{placeholder_list}

## Multiple types naming
* without type postfix (default name): fill/filled/solid
* with type postfix: outline/outlined/line

## Minified with [svg-minifier](https://github.com/cenfun/svg-minifier)
* Optimized with [svgo](https://github.com/svg/svgo)
* Compressed with [lz-string](https://github.com/pieroxy/lz-string)

## Statement of use
All icons are collected from the Internet ([npmjs.com](https://www.npmjs.com/) / [github.com](https://github.com/)), if you have any questions about the license to collect the icons, please submit an [issue](https://github.com/cenfun/open-icons/issues), Thanks.