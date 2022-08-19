# wi-{name}
Built from [{packageNameVersion}]({packageUrl})  

{stats}  

{readme}

# Screenshot
![screenshot](public/screenshot.png)

Online Page: [https://cenfun.github.io/wi/#{name}](https://cenfun.github.io/wi/#{name})

# Features
* Web Components
* Vector SVG Icons 
* Customize Size/Color/Background/Radius
* High Compressed Bundle
# Installation
```sh
npm install wi-{name}
```
# API Usage
```js
import { icons, getIcon } from "wi-{name}";

const $icon = document.createElement("wi-{name}");
$icon.setAttribute("name", "[icon-name]");
$icon.setAttribute("size", "64px");
$icon.setAttribute("color", "#000");
document.body.appendChild($icon);

// get all icons
icons.forEach(item => {
    console.log(getIcon(item.name))
});
```
# Browser Usage
```html

<script src="path-to/wi-{name}/dist/wi-{name}.js"></script>

<wi-{name} name="[icon-name]"></wi-{name}>
<wi-{name} name="[icon-name]" size="64px" color="#000" style="background:#f5f5f5;"></wi-{name}>
```
see [public/index.html](public/index.html)

## Minified with [svg-minifier](https://github.com/cenfun/svg-minifier)
* Optimized with [svgo](https://github.com/svg/svgo)
* Compressed with [lz-string](https://github.com/pieroxy/lz-string)