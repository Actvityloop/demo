import { LightningElement, track, wire } from 'lwc';
import getPicklistOptions from '@salesforce/apex/MyPicklistController.getPicklistOptions';
import mergeValues from '@salesforce/apex/MyPicklistController.mergeValues';

export default class MyPicklistComponent extends LightningElement {
    @track picklistValue;
    @track picklistOptions = [];
    @track multiSelectValue = [];
    @track multiSelectOptions = [];

    @wire(getPicklistOptions)
    wiredPicklistOptions({ error, data }) {
        if (data) {
            this.picklistOptions = data.picklistOptions;
            this.multiSelectOptions = data.multiSelectOptions;
        } else if (error) {
            // Handle error
        }
    }

    handlePicklistChange(event) {
        this.picklistValue = event.detail.value;
    }

    handleMultiSelectChange(event) {
        this.multiSelectValue = event.detail.value;
    }

    handleSubmit() {
        mergeValues({ 
            picklistValue: this.picklistValue, 
            multiSelectValues: this.multiSelectValue 
        })
        .then(result => {
            // Handle result
        })
        .catch(error => {
            // Handle error
        });
    }
}