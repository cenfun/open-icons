module.exports = {
    name: 'windows-icons',
    url: 'https://github.com/Templarian/WindowsIcons',

    downloadUrl: 'https://github.com/Templarian/WindowsIcons/archive/refs/heads/master.zip',
    moduleEntry: 'WindowsIcons-master',
    moduleFilters: 'WindowsPhone/svg',

    license: 'CC BY-ND 3.0',

    dirs: 'WindowsPhone/svg',

    onSVGName: function(name, item) {
        name = name.toLowerCase();

        name = name.replace(/^appbar\./g, '');

        name = name.replace(/_/g, '-');
        name = name.replace(/\./g, '-');
        //name = Helper.pascalToKebabCase(name);

        return this.onSVGNameDefault(name, item);
    },

    onSVGContent: function(content, item) {
        content = content.split('stop-color="#000000"').join('stop-color="currentColor"');
        content = content.split('fill="#000000"').join('fill="currentColor"');
        content = content.split('fill="#231F20"').join('fill="currentColor"');
        return content;
    }

};
