const FILE_FORM = document.forms[0];
const MSG_TYPES = {
    OK: 0,
    ERROR: 1
};
const MSG_TYPES_LEN = Object.keys(MSG_TYPES).length;
const MAX_YML_FILE_SIZE = 128e6;
FILE_FORM.ymlFile.onchange = handleFileSelection;

function onUploadComplete() {
    window.location = '/app.html';
}
function storeYml(yml) {
    localStorage.setItem('ymlSrc', yml);
}
function readFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}
function handleFileSelection(event) {
    const files = FILE_FORM.ymlFile.files;
    if (files.length === 0) {
        showMessage("No file selected. Please choose a file", MSG_TYPES.ERROR);
        return;
    }
    const file = files[0];
    if (file.type !== 'application/yaml') {
        showMessage("The file type must be application/yaml", MSG_TYPES.ERROR);
        return;
    }
    if (file.size > MAX_YML_FILE_SIZE) {
        showMessage("The file execeded the max size 128mb", MSG_TYPES.ERROR);
        return;
    }
    readFile(file)
        .then(content => storeYml(content))
        .then(() => onUploadComplete())
        .catch(error => showMessage(error, MSG_TYPES.ERROR));
}
function showMessage(message, type = MSG_TYPES.OK) {
    console.assert(2 === MSG_TYPES_LEN, 'Outdated messages type handeler');
    switch (type) {
        case MSG_TYPES.OK:
            console.log(message);
            break;
        case MSG_TYPES.ERROR:
            console.log(message);
            break;
    }
}
