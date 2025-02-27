if (!('ymlSrc' in localStorage)) {
    console.info('no yml loaded');
    setTimeout(() => window.location = '/', 400);
}
import '/scripts/modules/js-yaml.min.js'
const YAML_SRC = localStorage.getItem('ymlSrc');
const WISHLIST = jsyaml.load(YAML_SRC);

console.log(WISHLIST);
