import '/scripts/modules/js-yaml.min.js'
if (!('ymlSrc' in localStorage)) {
    console.info('no yml loaded');
    setTimeout(() => window.location = '/', 400);
}
const REQUIRED_KEYS_ON_PRODUCT = [
    'price' 
];
export const PRODUCTS_KEYS_PARSED = new Set([
    'name',
    'url',
    'image',
    'currency',
    'price'
]);

export function loadYaml(src) {
    const obj = jsyaml.load(src);
    for (const key in obj)
        if (key[0] === '_')
            delete obj[key];
    return obj;
}

function includesAnyElement(base, terms) {
    const base_len = base.length;
    let i = 0;
    while (i < base_len && !terms.includes(base[i]))
        i++;
    return i != base_len;
}

export function getCategories(wishlist, result = {}) {
    for (const tag in wishlist) {
        if (
            typeof wishlist[tag]  === 'object' &&
            !includesAnyElement(
                Object.keys(wishlist[tag]),
                REQUIRED_KEYS_ON_PRODUCT
            )) {
            result[tag] = {};
            getCategories(wishlist[tag], result[tag]);
        }
    }
    return result;
}

function getCategoryPath(categories, category, tagStack = []) {
    if (!categories) return [];
    let categoriesLst = Object.keys(categories);
    let categoriesLstLen = categoriesLst.length;
    if (categoriesLstLen === 0) return [];
    let i = 0;
    while (i < categoriesLstLen && (categoriesLst[i] !== category && !getCategoryPath(
        categories[categoriesLst[i]],
        category,
        [...tagStack, categoriesLst[i]]
    ).includes(category))) 
        i++;
    if (i == categoriesLstLen)
        return [];
    if (categoriesLst[i] === category)
        return [...tagStack, category]
    return getCategoryPath(
        categories[categoriesLst[i]],
        category,
        [...tagStack, categoriesLst[i]]
    );
}

export function getProductsFromTag(wishlist, categories, category) {
    const categoryPath = getCategoryPath(categories, category)
    return categoryPath.length === 0 ?
        null :
        categoryPath.reduce((acc, cat) => acc ? acc[cat] : null, wishlist);
}

export function getProducts(wishlist, categories, products = {}) {
    if (!categories) return;
    let categoriesLst = Object.keys(categories);
    let categoriesLstLen = categoriesLst.length;
    if (categoriesLstLen === 0) {
        Object.keys(wishlist).forEach(productName => products[productName] = wishlist[productName]);
        return;
    };
    let subcaregories;
    for (let i = 0; i < categoriesLstLen; i++) {
        console.assert(typeof wishlist[categoriesLst[i]]  === 'object', 'Unexpected');
        if (includesAnyElement(
            Object.keys(wishlist[categoriesLst[i]]),
            REQUIRED_KEYS_ON_PRODUCT
        )) {
            alert('sucede');
            products.push(wishlist[categoriesLst[i]]);
            console.log(products.at(-1));
        } else {
            subcaregories = getCategories(wishlist[categoriesLst[i]]);
            getProducts(wishlist[categoriesLst[i]], subcaregories, products);
        }
    }
    return products;
}

export const SORTING_METHODS = {
    price: (arr) => arr.sort((a,b) => a-b),
    lifo: (arr) => arr
}
