/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is not neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/display.js":
/*!************************!*\
  !*** ./src/display.js ***!
  \************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony import */ var _src_storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/storage */ \"./src/storage.js\");\n\r\n\r\nconst Display = (() => {\r\n    const _wrapper = document.querySelector('#wrapper');\r\n    const _sidebar = document.querySelector('#sidebar');\r\n    const _sidebarHeader = document.querySelector('.sidebar-header');\r\n    const _projectView = document.querySelector('#project-view');\r\n    const _addProjectText = document.querySelector('#add-project-text');\r\n    const _addProjectInput = document.querySelector('#add-project-input');\r\n\r\n    const init = () => {\r\n        _addProjectText.addEventListener('click', toggleAddProjectInput);\r\n        _addProjectInput.addEventListener('focusout', toggleAddProjectInput);\r\n        _addProjectInput.addEventListener('change', addProject);\r\n    };\r\n\r\n    const populateProjectList = () => {\r\n        let projects = _src_storage__WEBPACK_IMPORTED_MODULE_0__.default.getProjects();\r\n        _sidebarHeader.addEventListener('click', toggleProjectList);\r\n\r\n        if (!projects) return;\r\n        projects.forEach(project => {\r\n            addToProjectList(project);\r\n        });\r\n    };\r\n\r\n    const addToProjectList = (project) => {\r\n        const sidebarItemTemplate = document.querySelector('#sidebar-item-template');\r\n        const projectList = _sidebarHeader.querySelector('ul');\r\n\r\n        let clone = sidebarItemTemplate.content.cloneNode(true);\r\n        let item = clone.querySelector('li');\r\n\r\n        item.textContent = project.getTitle();\r\n        projectList.insertBefore(item, projectList.lastElementChild);\r\n\r\n        item.addEventListener('click', showProject);\r\n    }\r\n\r\n    const toggleProjectList = (e) => {\r\n        if (!e.target.classList.contains('sidebar-header')) return;\r\n\r\n        let items = document.querySelectorAll('li');\r\n        let chevron = _sidebarHeader.querySelector('i');\r\n\r\n        items.forEach(item => {\r\n            if (item.classList.contains('expanded')) {\r\n                item.classList.remove('expanded');\r\n                chevron.classList.remove('rotate');\r\n            } else {\r\n                item.classList.add('expanded');\r\n                chevron.classList.add('rotate');\r\n            }\r\n        });\r\n    };\r\n\r\n    const toggleAddProjectInput = (e) => {\r\n        if (getComputedStyle(_addProjectInput).display === 'none') {\r\n            _addProjectInput.style.display = 'block';\r\n            _addProjectText.style.display = 'none';\r\n            _addProjectInput.focus();\r\n\r\n        } else {\r\n            _addProjectInput.style.display = 'none';\r\n            _addProjectText.style.display = 'block';\r\n        }\r\n    };\r\n\r\n    const addProject = (e) => {\r\n        let title = e.target.value;\r\n        if (title.trim() === '') return;\r\n\r\n        let project = _src_storage__WEBPACK_IMPORTED_MODULE_0__.default.addProject(title);\r\n        addToProjectList(project);\r\n    };\r\n\r\n    const showProject = (e) => {\r\n        if (!e?.target?.textContent) return;\r\n\r\n        const todoContainer = document.querySelector('#todo-container');\r\n        const todoTemplate = document.querySelector('#todo-template');\r\n        let projects = _src_storage__WEBPACK_IMPORTED_MODULE_0__.default.getProjects();\r\n        \r\n        while (todoContainer.hasChildNodes()) {\r\n            todoContainer.firstChild.remove();\r\n        }\r\n\r\n        let project = projects.filter(project => project.title === e.target.textContent)[0];\r\n        \r\n        let projectTitle = _projectView.querySelector('.project-title');\r\n        projectTitle.textContent = project.title;\r\n\r\n        project.todos.forEach(todo => {\r\n            let clone = todoTemplate.content.firstElementChild.cloneNode(true);\r\n            clone.insertAdjacentHTML('beforeEnd', todo.title);\r\n            clone.classList.add('todo');\r\n            clone.addEventListener('click', showTodo);\r\n            todoContainer.appendChild(clone);\r\n        });\r\n    };\r\n\r\n    const showTodo = (e) => {\r\n        console.log(e?.target);\r\n    };\r\n\r\n    return {\r\n        init,\r\n        populateProjectList\r\n    };\r\n})();\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Display);\n\n//# sourceURL=webpack://todo/./src/display.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! namespace exports */
/*! exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _src_display__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/display */ \"./src/display.js\");\n\r\n\r\nconst init = () => {\r\n    _src_display__WEBPACK_IMPORTED_MODULE_0__.default.init();\r\n    _src_display__WEBPACK_IMPORTED_MODULE_0__.default.populateProjectList();\r\n};\r\n\r\nwindow.addEventListener('load', init);\r\n\n\n//# sourceURL=webpack://todo/./src/index.js?");

/***/ }),

/***/ "./src/project.js":
/*!************************!*\
  !*** ./src/project.js ***!
  \************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\nconst Project = (title) => {\r\n    let _title = title;\r\n    let _todos = [];\r\n    \r\n    const getTitle = () => _title;\r\n\r\n    const setTitle = (title) => {\r\n        _title = title;\r\n    };\r\n\r\n    const getTodos = () => _todos;\r\n\r\n    const addTodo = (todo) => {\r\n        _todos.push(todo);\r\n    };\r\n\r\n    const removeTodo = (index) => {\r\n        _todos.splice(index, 1);\r\n    };\r\n\r\n    return {\r\n        getTitle,\r\n        setTitle,\r\n        getTodos,\r\n        addTodo,\r\n        removeTodo\r\n    };\r\n};\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Project);\n\n//# sourceURL=webpack://todo/./src/project.js?");

/***/ }),

/***/ "./src/storage.js":
/*!************************!*\
  !*** ./src/storage.js ***!
  \************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony import */ var _src_project__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/project */ \"./src/project.js\");\n\r\n\r\nconst Storage = (() => {\r\n    let _storageItemName = 'projects';\r\n    let _projects = [];\r\n\r\n    const addProject = (title) => {\r\n        let project = (0,_src_project__WEBPACK_IMPORTED_MODULE_0__.default)(title);\r\n        _projects.push(project);\r\n        return project;\r\n    };\r\n\r\n    const getProjects = () => {\r\n        if (Array.isArray(_projects) && _projects.length !== 0) {\r\n            return _projects;\r\n        }\r\n    };\r\n\r\n    const saveToLocalStorage = () => {\r\n        localStorage.setItem(_storageItemName, JSON.stringify(_projects));\r\n    };\r\n\r\n    const loadFromLocalStorage = () => {\r\n        let projects = localStorage.getItem(_storageItemName);\r\n        if (!projects) return;\r\n        _projects = JSON.parse(projects);\r\n    };\r\n\r\n    return {\r\n        addProject,\r\n        getProjects,\r\n        saveToLocalStorage,\r\n        loadFromLocalStorage\r\n    };\r\n})();\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Storage);\n\n//# sourceURL=webpack://todo/./src/storage.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./src/index.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;