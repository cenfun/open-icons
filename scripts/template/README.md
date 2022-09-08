# open-icons
> Open source icons collection

![](https://img.shields.io/npm/v/open-icons)
![](https://img.shields.io/librariesio/github/cenfun/open-icons)
![](https://img.shields.io/librariesio/dependents/npm/open-icons)
[![](https://badgen.net/npm/dw/open-icons)](https://www.npmjs.com/package/open-icons)

## Homepage
[https://cenfun.github.io/open-icons/](https://cenfun.github.io/open-icons/)

# Installation
```sh
npm install open-icons
```

## Packages
{placeholder_list}


## Features
* Pure SVG icons 
* fill/stroke with currentColor
* High compressed bundle
* UMD format bundle
* Web components
* Customize size/color/BG/radius
* kebab-case naming

## Usage
```js
import { decompress } from 'open-icons';
import xxxPkg from "open-icons/dist/open-icons-[xxx].js";

const pkg = JSON.parse(decompress(xxxPkg));
console.log(pkg);

```

## Multiple types naming
* without type postfix (default name): fill/filled/solid
* with type postfix: outline/outlined/line

## Minified with [svg-minifier](https://github.com/cenfun/svg-minifier)
* Optimized with [svgo](https://github.com/svg/svgo)
* Compressed with [lz-string](https://github.com/pieroxy/lz-string)

## Statement of use
All icons are collected from the Internet ([npmjs.com](https://www.npmjs.com/) / [github.com](https://github.com/)), if you have any questions about the license to use the icons, please submit an [issue](https://github.com/cenfun/open-icons/issues), Thanks.