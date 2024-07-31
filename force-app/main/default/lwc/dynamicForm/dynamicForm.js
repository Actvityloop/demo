import { LightningElement, track } from 'lwc';

export default class DynamicFormBuilder extends LightningElement {
    @track formElements = [];
    @track generatedUrl = '';

    handleDragStart(event) {
        event.dataTransfer.setData('text/plain', event.target.dataset.type);
    }

    handleDragOver(event) {
        event.preventDefault();
    }

    handleDrop(event) {
        event.preventDefault();
        const elementType = event.dataTransfer.getData('text/plain');
        const newElement = { id: Date.now(), type: elementType };
        this.formElements = [...this.formElements, newElement];
    }

    generateUrl() {
        const formStructure = this.formElements.map(el => el.type).join(',');
        this.generatedUrl = `https://google.com/form?elements=${encodeURIComponent(formStructure)}`;
    }

    isTextInput(element) {
        return element.type === 'text';
    }

    isTextArea(element) {
        return element.type === 'textarea';
    }

    isSelect(element) {
        return element.type === 'select';
    }
}