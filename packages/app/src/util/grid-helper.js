
import { saveAs } from 'file-saver';
import { h, createApp } from 'vue';
import { getSettingsSize } from './util.js';

const getColor = function(settings, colorIndex) {

    const color = settings.color;

    if (color === 'rainbow') {
        const colors = [
            'orangered',
            'orange',
            'green',
            'deepskyblue',
            'royalblue',
            'darkorchid'
        ];
        const index = colorIndex % colors.length;
        return colors[index];
    }

    if (color === 'custom') {
        return settings.colorCustom;
    }

    return color;
};

const getBG = (settings) => {
    const bg = settings.bg;
    if (bg === 'custom') {
        return settings.bgCustom;
    }
    return bg;
};

const getIconTooltip = (settings) => {
    if (settings.iconZoomIn) {
        return 'tooltip="icon"';
    }
    return '';
};

const getWCIcon = function(settings, icon) {
    const size = `${getSettingsSize(settings)}px`;
    const color = getColor(settings, icon.tg_index);
    const bg = getBG(settings);
    const tag = icon.tagName;
    const tip = getIconTooltip(settings);
    return `<${tag} name="${icon.id}" size="${size}" color="${color}" bg="${bg}" radius="${settings.radius}" ${tip}></${tag}>`;
};

export const getCellIcon = function(settings, icon) {
    if (settings.type === 'wc') {
        return getWCIcon(settings, icon);
    }

    const size = `${getSettingsSize(settings)}px`;

    const st = [`--size: ${size};`];

    const color = getColor(settings, icon.tg_index);
    if (color) {
        st.push(`--color: ${color};`);
    }
    const bg = getBG(settings);
    if (bg) {
        st.push(`--bg: ${bg};`);
    }
    const radius = settings.radius;
    if (radius) {
        st.push(`--radius: ${radius};`);
    }

    const tip = getIconTooltip(settings);

    return `
        <div class="oi-cell-icon" style="${st.join('')}" ${tip}>
            ${icon.svg}
        </div>
    `;
};

export const getSourceFrom = function(source, text) {

    let name = source.name;
    if (source.version) {
        name += `@${source.version}`;
    }

    if (text) {
        return name;
    }

    return `<a href="${source.url}" target="_blank">${name}</a>`;
};

export const formatter = {

    null: function(value) {
        if (value === null || typeof value === 'undefined') {
            return '';
        }
        return value;
    },

    string: function(value, rowItem, columnItem) {
        const id = columnItem.id;
        const matched = rowItem[`${id}_matched`];
        if (matched) {
            value = matched;
        }
        return value;
    },

    download: function(v) {
        return `
            <div class="oi-action-downloads vui-flex-row">
                <div class="oi-icon-download" name="svg" title="download svg file">SVG</div>
                <div class="oi-icon-download" name="png" title="download png file">PNG</div>
            <div>
        `;
    },

    textarea: function(v, r, c) {
        if (c.id === 'svg') {
            return `<textarea spellcheck="false">${v}</textarea>`;
        }
        if (c.id === 'dataUrl') {
            const content = r.svg;
            const dataUrl = `data:image/svg+xml;charset=utf8,${encodeURIComponent(content)}`;
            return `<textarea spellcheck="false">${dataUrl}</textarea>`;
        }
        return `<textarea spellcheck="false">${this.getFormatter('icon')(v, r)}</textarea>`;
    }
};


export const copyContent = function(content) {
    navigator.clipboard.writeText(content);
};

export const savePNG = function(content, name, settings) {

    let color = settings.color;
    if (color === 'custom') {
        color = settings.colorCustom;
    }

    content = content.replace(/currentColor/g, color);

    const dataUrl = `data:image/svg+xml;charset=utf8,${encodeURIComponent(content)}`;

    const size = getSettingsSize(settings);
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    canvas.style.cssText = 'position:absolute;top:0;right:0;';
    const ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);

    const img = document.createElement('img');
    img.width = size;
    img.height = size;
    img.src = dataUrl;
    img.onload = function() {
        ctx.drawImage(img, 0, 0);
        document.body.removeChild(img);
        canvas.toBlob(function(blob) {
            saveAs(blob, `${name}.png`);
            document.body.removeChild(canvas);
        });
    };
    document.body.appendChild(img);

};

export const saveSVG = function(content, name) {
    const blob = new Blob([content], {
        type: 'text/plain;charset=utf-8'
    });
    saveAs(blob, `${name}.svg`);
};

export const getVueEl = function(Component, props, slots) {
    const vn = h(Component, props, slots);
    createApp({
        setup() {
            return () => {
                return vn;
            };
        }
    }).mount(document.createElement('div'));
    return vn.el;
};
