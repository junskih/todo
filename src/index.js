import Display from '../src/display';

const init = () => {
    Display.init();
    Display.populateProjectList();
};

window.addEventListener('load', init);
