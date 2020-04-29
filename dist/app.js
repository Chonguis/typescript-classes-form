"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function validateInputs(data) {
    let isValid = true;
    if (isValid && data.required) {
        if (data.value.toString().trim().length === 0) {
            isValid = false;
        }
    }
    if (isValid && typeof data.value === "string") {
        if (data.minLength && data.minLength > data.value.length) {
            isValid = false;
        }
        if (data.maxLength && data.maxLength < data.value.length) {
            isValid = false;
        }
    }
    if (isValid && typeof data.value === "number") {
        if (data.min && data.min > data.value) {
            isValid = false;
        }
        if (data.max && data.max < data.value) {
            isValid = false;
        }
    }
    if (isValid) {
        return data.value;
    }
    else {
        return;
    }
}
// decorator, los primeros 2 atributos no entiendo pq se pasan pq no se usan
function autobind(_, _2, descriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    };
    return adjDescriptor;
}
class List {
    constructor(type) {
        this.templateElement = document.getElementById("listTemplate");
        this.hostElement = document.getElementById("app");
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        const header = this.element.querySelector("h3");
        header.innerHTML = `${type}-template`;
        this.attach();
    }
    attach() {
        this.hostElement.insertAdjacentElement('beforeend', this.element);
    }
}
// class form coge el template element y lo inyecta al hostElement, tiene los listeners
class Form {
    constructor() {
        this.templateElement = document.getElementById("formTemplate");
        this.hostElement = document.getElementById("app");
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = "form";
        this.titleElement = this.element.querySelector("#title");
        this.descriptionElement = this.element.querySelector("#description");
        this.peopleElement = this.element.querySelector("#people");
        this.attach();
        this.configure();
    }
    attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }
    configure() {
        this.element.addEventListener("submit", this.onSubmit);
    }
    onSubmit(e) {
        e.preventDefault();
        let validatedTouple = this.getInputs();
        this.clearInputs();
        if (Array.isArray(validatedTouple))
            console.log("Got Array", validatedTouple);
    }
    getInputs() {
        const title = {
            value: this.titleElement.value,
            required: true,
            minLength: 3,
        };
        const description = {
            value: this.descriptionElement.value,
            required: true,
            minLength: 3,
        };
        const people = {
            value: +this.peopleElement.value,
            required: true,
            min: 3,
        };
        let validatedTitle = validateInputs(title);
        let validatedDescription = validateInputs(description);
        let validatedPeople = validateInputs(people);
        if (!validatedTitle || !validatedDescription || !validatedPeople) {
            alert("Error, try again");
            return;
        }
        return [validatedTitle.toString(), validatedDescription.toString(), +validatedPeople];
    }
    clearInputs() {
        this.titleElement.value = "";
        this.descriptionElement.value = "";
        this.peopleElement.value = "";
    }
}
__decorate([
    autobind
], Form.prototype, "onSubmit", null);
const initForm = new Form();
const activeList = new List("ACTIVE");
const completedList = new List("COMPLETED");
