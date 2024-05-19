"use strict";

/**
 * Shiva: A lightweight utility library for enhanced HTML element manipulation.
 * Provides methods for creating, styling, adding data, attributes, events,
 * scripts, and rendering HTML elements.
 * 
 * @license MIT License
 * @author Chauhan Pruthviraj
 * @contact nazrotech@outlook.com
 */

export default class Shiva {
    /**
     * Creates a new HTML element with additional Shiva properties.
     * This method ensures that the created element has custom properties for
     * extended functionality while keeping memory usage optimized.
     * 
     * @param {string} elementName - The name of the element to create (e.g., 'div').
     * @returns {Promise<HTMLElement|null>} The created element or null if an error occurs.
     */
    static create(elementName = "div") {
        if (typeof elementName !== "string") {
            console.error("Shiva Error: Invalid element name provided. Must be a string.");
            return null;
        }
        try {
            const element = document.createElement(elementName);
            element.shivaElement = element; // Using the same element to avoid redundancy
            element.shivaRoot = null;
            element.shivaData = null;
            element.shivaStyle = {};
            element.shivaAttributes = {};
            element.shivaEvents = {};
            return element;
        } catch (error) {
            console.error("Shiva Error: Error creating element.", error);
            return null;
        }
    }

    /**
     * Adds styles to an HTML element.
     * This method optimizes memory usage by directly assigning styles and storing them in a plain object.
     * 
     * @param {HTMLElement} element - The element to which styles will be added.
     * @param {Object} style - An object representing CSS styles (e.g., {height: "100px", width: "200px"}).
     */
    static addStyle(element, style = {}) {
        if (!(element instanceof HTMLElement) || typeof style !== "object") {
            console.error("Shiva Error: Invalid element or style object provided.");
            return;
        }
        Object.assign(element.style, style);
        Object.assign(element.shivaStyle, style);
    }

    /**
     * Adds data to an HTML element.
     * This method directly assigns the data to the element's inner HTML and stores it in a custom property.
     * 
     * @param {HTMLElement} element - The element to which data will be added.
     * @param {string} data - The data to be added as inner HTML.
     */
    static addData(element, data = "") {
        if (!(element instanceof HTMLElement) || typeof data !== "string") {
            console.error("Shiva Error: Invalid element or data provided.");
            return;
        }
        element.innerHTML = data;
        element.shivaData = data;
    }

    /**
     * Adds attributes to an HTML element.
     * This method optimizes memory usage by storing attributes in a plain object and directly assigning them to the element.
     * 
     * @param {HTMLElement} element - The element to which attributes will be added.
     * @param {Object} attributes - An object representing attributes and their values.
     */
    static addAttributes(element, attributes = {}) {
        if (!(element instanceof HTMLElement) || typeof attributes !== "object") {
            console.error("Shiva Error: Invalid element or attributes object provided.");
            return;
        }
        for (const [key, value] of Object.entries(attributes)) {
            element.setAttribute(key, value);
            element.shivaAttributes[key] = value;
        }
    }

    /**
     * Adds an event listener to an HTML element with support for event modifiers.
     * This method enhances the basic addEvent method by allowing the specification of modifiers 
     * such as preventing default behavior or stopping event propagation.
     * 
     * @param {HTMLElement} element - The element to which the event listener will be added.
     * @param {string} event - The event type (e.g., 'click').
     * @param {Function} runFunction - The function to be executed when the event is triggered.
     * @param {Object} modifiers - An object specifying event modifiers (e.g., {preventDefault: true, stopPropagation: false}).
     */
    static addEventWithModifiers(element, event, runFunction, modifiers = {}) {
        if (!(element instanceof HTMLElement) || typeof event !== "string" || typeof runFunction !== "function") {
            console.error("Shiva Error: Invalid element, event type, or event handler function provided.");
            return;
        }
        const handler = (e) => {
            if (modifiers.preventDefault) {
                e.preventDefault();
            }
            if (modifiers.stopPropagation) {
                e.stopPropagation();
            }
            runFunction(e);
        };
        element.addEventListener(event, handler);
        element.shivaEvents[event] = handler;
    }
    /**
     * Adds a script to an HTML element.
     * This method optimizes memory usage by directly appending a script to the element and removing it after execution.
     * 
     * @param {HTMLElement} element - The element to which the script will be added.
     * @param {string} filePath - The relative path to the script file.
     */
    static addScript(element, filePath) {
        if (!(element instanceof HTMLElement) || typeof filePath !== "string") {
            console.error("Shiva Error: Invalid element or script file path provided.");
            return;
        }
        const script = document.createElement("script");
        script.src = filePath;
        script.classList.add("removable-element");
        element.append(script);
        script.remove();
    }

    /**
     * Adds and runs a module script to an HTML element.
     * This method optimizes memory usage by directly appending a module script to the element and removing it after execution.
     * 
     * @param {HTMLElement} element - The element to which the script will be added.
     * @param {string} filePath - The relative path to the script file.
     */
    static async loadScript(element, filePath) {
        if (!(element instanceof HTMLElement) || typeof filePath !== "string") {
            console.error("Shiva Error: Invalid element or script file path provided.");
            return;
        }
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`Failed to load script: ${response.status} - ${response.statusText}`);
            }
            const scriptContent = await response.text();
            const script = document.createElement("script");
            script.textContent = scriptContent;
            element.appendChild(script);
        } catch (error) {
            console.error("Shiva Error: Error occurred while loading script.", error);
        }
    }

    /**
     * Renders an element into a parent element.
     * This method ensures that the child element is appended to the parent element and keeps track of the parent element reference.
     * 
     * @param {HTMLElement} element - The element to be inserted.
     * @param {HTMLElement} parentElement - The parent element in which to insert the child element.
     */
    static renderInto(element, parentElement) {
        if (!(element instanceof HTMLElement) || !(parentElement instanceof HTMLElement)) {
            console.error("Shiva Error: Invalid element or parent element provided.");
            return;
        }
        parentElement.append(element);
        element.shivaRoot = parentElement;
    }

    /**
     * Renders an element into a root element by ID.
     * This method ensures that the child element is appended to the root element and keeps track of the root element reference.
     * 
     * @param {HTMLElement} element - The element to be inserted.
     * @param {string} rootElementId - The ID of the root element.
     */
    static render(element, rootElementId) {
        if (!(element instanceof HTMLElement)) {
            console.error("Shiva Error: Invalid element provided.");
            return;
        }
        try {
            const root = document.getElementById(rootElementId);
            if (!root) {
                console.error(`Shiva Error: Root element with ID "${rootElementId}" not found.`);
                return;
            }
            root.appendChild(element);
            element.shivaRoot = root;
        } catch (error) {
            console.error("Shiva Error: Unexpected error occurred during rendering.", error);
        }
    }

    /**
     * Logs detailed information about an element.
     * This method outputs the element's custom properties and their current values to the console.
     * 
     * @param {HTMLElement} element - The element whose information will be logged.
     */
    static info(element) {
        if (!(element instanceof HTMLElement)) {
            console.error("Shiva Error: Invalid element provided for info.");
            return;
        }
        console.log(element);
        console.log("Style:", element.shivaStyle);
        console.log("Data:", element.shivaData);
        console.log("Root:", element.shivaRoot);
        console.log("Attributes:", element.shivaAttributes);
        console.log("Events:", element.shivaEvents);
    }
}


