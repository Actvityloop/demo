import { LightningElement, track, wire } from 'lwc';
import getObjectList from '@salesforce/apex/ObjectController.getObjectList';
import getObjectFields from '@salesforce/apex/ObjectController.getObjectFields';

export default class FormBuilder extends LightningElement {
    @track formFields = [];
    @track selectedFieldId;
    @track previewMode = false;
    @track formSaved = false;
    @track showModal = false;
    @track showObjectSelection = false;
    @track selectedObject = '';
    @track objectList = [];
    @track showFormSummary = false;
    @track editMode = false;
    @track objectFields = [];

    connectedCallback() {
        this.loadObjectList();
        this.loadFormData();
    }

    loadObjectList() {
        getObjectList()
            .then(result => {
                this.objectList = result.map(obj => ({ label: obj, value: obj }));
            })
            .catch(error => {
                console.error('Error fetching object list:', error);
            });
    }

    loadObjectFields(objectName) {
        getObjectFields({ objectName })
            .then(result => {
                this.objectFields = result.map(field => ({
                    label: field.label,
                    value: field.name,
                    type: field.type
                }));
            })
            .catch(error => {
                console.error('Error fetching object fields:', error);
            });
    }

    loadFormData() {
        const savedFormData = localStorage.getItem('savedFormData');
        if (savedFormData) {
            this.formFields = JSON.parse(savedFormData);
            this.formSaved = true;
            this.previewMode = true;
        }
    }

    handleDragStart(event) {
        event.dataTransfer.setData('fieldType', event.target.dataset.type);
    }

    handleDragOver(event) {
        event.preventDefault();
    }

    handleDrop(event) {
        event.preventDefault();
        const fieldType = event.dataTransfer.getData('fieldType');
        this.addField(fieldType);
    }

    addField(fieldType) {
        const id = this.formFields.length + 1;
        let label, type, size;
        switch (fieldType) {
            case 'text':
                label = 'Text Field';
                type = 'text';
                size = '12';
                break;
            case 'textarea':
                label = 'Text Area';
                type = 'textarea';
                size = '12';
                break;
            case 'date':
                label = 'Date Field';
                type = 'date';
                size = '12';
                break;
            case 'longtext':
                label = 'Long Text Field';
                type = 'textarea';
                size = '12';
                break;
            default:
                label = 'Unknown';
                type = 'text';
                size = '12';
        }
        this.formFields.push({ id, label, type, size, value: '' });
        this.saveFormData();
    }

    handleFieldClick(event) {
        this.selectedFieldId = event.currentTarget.dataset.id;
    }

    handleLabelChange(event) {
        const fieldId = this.selectedFieldId;
        const newLabel = event.target.value;
        this.updateField(fieldId, 'label', newLabel);
    }

    handleSizeChange(event) {
        const fieldId = this.selectedFieldId;
        const newSize = event.target.value;
        this.updateField(fieldId, 'size', newSize);
    }

    updateField(fieldId, property, value) {
        this.formFields = this.formFields.map(field => {
            if (field.id === parseInt(fieldId, 10)) {
                return { ...field, [property]: value };
            }
            return field;
        });
        this.saveFormData();
    }

    handleSave() {
        console.log('Form Layout Saved:', JSON.stringify(this.formFields));
        this.formSaved = true;
        this.previewMode = true;
        this.editMode = false;
        this.showModal = false;
        this.showFormSummary = false;
        this.saveFormData();
    }

    handleCancel() {
        this.formFields = [];
        this.selectedFieldId = null;
        this.previewMode = false;
        this.formSaved = false;
        this.showModal = false;
        this.showObjectSelection = false;
        this.showFormSummary = false;
        this.editMode = false;
        localStorage.removeItem('savedFormData');
    }

    handlePreview() {
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
        this.showObjectSelection = false;
        this.showFormSummary = false;
    }

    handleNext() {
        this.showModal = false;
        this.showObjectSelection = true;
    }

    handleObjectChange(event) {
        this.selectedObject = event.detail.value;
        this.loadObjectFields(this.selectedObject);
    }

    handleObjectNext() {
        this.showObjectSelection = false;
        this.showFormSummary = true;
    }

    handleEdit() {
        this.editMode = true;
        this.previewMode = false;
    }

    saveFormData() {
        localStorage.setItem('savedFormData', JSON.stringify(this.formFields));
    }

    get selectedField() {
        return this.formFields.find(field => field.id === parseInt(this.selectedFieldId, 10));
    }

    get isEditing() {
        return this.editMode || !this.previewMode;
    }

    get showFieldProperties() {
        return this.selectedField && this.isEditing;
    }

    get isFormSaved() {
        return this.formSaved;
    }
}