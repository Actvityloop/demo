import { LightningElement, api, track } from 'lwc';

export default class RecordCreationForm extends LightningElement {
    @api index;
    @api fields = [];
    @track fieldValues = {};
    
    // Prepare field value for the template
    get preparedFields() {
        return this.fields.map(field => ({
            ...field,
            value: this.fieldValues[field.fieldName] || '',
            isMultiPicklistSelected: this.fieldValues[field.fieldName] ? this.fieldValues[field.fieldName] : []
        }));
    }

    // Handles field change events
    handleFieldChange(event) {
        const fieldName = event.target.dataset.field;
        const fieldValue = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        this.fieldValues = { ...this.fieldValues, [fieldName]: fieldValue };

        this.dispatchEvent(new CustomEvent('fieldchange', {
            detail: { fieldName, value: fieldValue, index: this.index }
        }));
    }

    // Handles the removal of the record
    handleRemoveRecord() {
        this.dispatchEvent(new CustomEvent('removerecord', {
            detail: { index: this.index }
        }));
    }
}