import { ApplicationModel } from './ApplicationModel.js';
import { ApplicationUI } from './ApplicationUI.js';

function main() {
    const appModel = new ApplicationModel();

    const appUI = new ApplicationUI(appModel);

    appUI.start();
}

window.onload = main;
