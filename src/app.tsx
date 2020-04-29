
//interface ValidateTable
interface ValidateTable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validateInputs(data: ValidateTable): string | number | void {
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
  } else {
    return;
  }
}

// decorator, los primeros 2 atributos no entiendo pq se pasan pq no se usan
function autobind(
  _: any, _2: string, descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get(){
      const boundFn = originalMethod.bind(this);
      return boundFn
    }
  }
  return adjDescriptor;
}

class List {
    // template element q voy a inyectar al html, template no es visible
    templateElement: HTMLTemplateElement;
    // donde voy a inyectar el template con this.hostElement.insertAdjacentElement('afterbegin', this.element);
    hostElement: HTMLDivElement;
    // donde voy a meter el form q saco del template con const importedNode = document.importNode(this.templateElement.content, true); this.element = importedNode.firstElementChild as HTMLFormElement;
    element: HTMLFormElement;

  constructor(type: "ACTIVE" | "COMPLETED"){

    this.templateElement = document.getElementById("listTemplate") as HTMLTemplateElement;
    this.hostElement = document.getElementById("app") as HTMLDivElement;
    const importedNode = document.importNode(this.templateElement.content, true);
    this.element = importedNode.firstElementChild as HTMLFormElement;
    
    const header = this.element.querySelector("h3") as HTMLHeadingElement;
    header.innerHTML = `${type}-template`;

    this.attach();
  }
  private attach(){
    this.hostElement.insertAdjacentElement('beforeend', this.element);
  }
}

// class form coge el template element y lo inyecta al hostElement, tiene los listeners
class Form {
  // template element q voy a inyectar al html, template no es visible
  templateElement: HTMLTemplateElement;
  // donde voy a inyectar el template con this.hostElement.insertAdjacentElement('afterbegin', this.element);
  hostElement: HTMLDivElement;
  // donde voy a meter el form q saco del template con const importedNode = document.importNode(this.templateElement.content, true); this.element = importedNode.firstElementChild as HTMLFormElement;
  element: HTMLFormElement;

  //inputs
  titleElement: HTMLInputElement;
  descriptionElement: HTMLInputElement;
  peopleElement: HTMLInputElement;

  constructor(){
    this.templateElement = document.getElementById("formTemplate") as HTMLTemplateElement;
    this.hostElement = document.getElementById("app") as HTMLDivElement;
    const importedNode = document.importNode(this.templateElement.content, true);
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = "form";

    this.titleElement = this.element.querySelector("#title") as HTMLInputElement;
    this.descriptionElement = this.element.querySelector("#description") as HTMLInputElement;
    this.peopleElement = this.element.querySelector("#people") as HTMLInputElement;

    this.attach();
    this.configure();
  }
  private attach(){
    this.hostElement.insertAdjacentElement('afterbegin', this.element);
  }
  private configure(){
    this.element.addEventListener("submit", this.onSubmit);
  }
  @autobind
  private onSubmit(e: Event){
    e.preventDefault();
    let validatedTouple = this.getInputs();
    this.clearInputs();
    if (Array.isArray(validatedTouple)) console.log("Got Array", validatedTouple);
  }

  private getInputs(): [string, string, number] | void {
    const title: ValidateTable = {
      value: this.titleElement.value,
      required: true,
      minLength: 3,      
    }
    const description: ValidateTable = {
      value: this.descriptionElement.value,
      required: true,
      minLength: 3,      
    }
    const people: ValidateTable = {
      value: +this.peopleElement.value,
      required: true,
      min: 3,      
    }
    let validatedTitle = validateInputs(title);
    let validatedDescription = validateInputs(description);
    let validatedPeople = validateInputs(people);
    if (!validatedTitle || !validatedDescription || !validatedPeople) {
      alert("Error, try again");
      return;
    }
    return [validatedTitle.toString(), validatedDescription.toString(), +validatedPeople];
  }

  private clearInputs(){
    this.titleElement.value = "";
    this.descriptionElement.value = "";
    this.peopleElement.value = "";
  }
}

const initForm = new Form();
const activeList = new List("ACTIVE");
const completedList = new List("COMPLETED");