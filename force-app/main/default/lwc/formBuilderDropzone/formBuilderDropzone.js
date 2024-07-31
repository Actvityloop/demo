import { LightningElement, api } from 'lwc';

export default class FormBuilderDropzone extends LightningElement {
    @api formFields;

    handleDrop(event) {
        event.preventDefault();
        const fieldType = event.dataTransfer.getData('fieldType');
        const eventDetail = { fieldType };
        this.dispatchEvent(new CustomEvent('fieldadd', { detail: eventDetail }));
    }

    handleDragOver(event) {
        event.preventDefault();
    }

    handleFieldClick(event) {
        const fieldId = event.currentTarget.dataset.id;
        const eventDetail = { fieldId };
        this.dispatchEvent(new CustomEvent('fieldclick', { detail: eventDetail }));
    }

    get isEditing() {
        // Implement as per your logic
        return true;
    }
}