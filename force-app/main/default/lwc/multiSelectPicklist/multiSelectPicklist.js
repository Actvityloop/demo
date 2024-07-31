import { LightningElement, api, track } from 'lwc';

export default class MultiSelectPicklist extends LightningElement {
    @api label;
    @api options;
    @track value = [];

    handleChange(event) {
        this.value = event.detail.value;
        const changeEvent = new CustomEvent('change', {
            detail: { value: this.value }
        });
        this.dispatchEvent(changeEvent);
    }
}