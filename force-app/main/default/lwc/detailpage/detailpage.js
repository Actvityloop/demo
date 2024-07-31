import { LightningElement } from 'lwc';

export default class Detailpage extends LightningElement {
    field1 = '';
    field2 = '';
    generatedUrl = '';

    handleInputChange(event) {
        const field = event.target.label.toLowerCase().replace(' ', '');
        this[field] = event.target.value;
    }

    generateUrl() {
        const baseUrl = 'https://yourdomain.com/form?';
        const params = new URLSearchParams({
            field1: this.field1,
            field2: this.field2
        });
        this.generatedUrl = baseUrl + params.toString();
    }
}