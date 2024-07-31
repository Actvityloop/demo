import { LightningElement,api,wire,track } from 'lwc';
//import getRelatedListData from '@salesforce/apex/RelatedList.getRelatedListData';
export default class AddorExpoloreData extends LightningElement {
@api recordId;  // Accept recordId from Visualforce
    @track relatedListData;
    /*@track columns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Close Date', fieldName: 'CloseDate', type: 'date' },
        { label: 'Stage', fieldName: 'StageName' }
    ];
    @track draftValues = [];

    @wire(getRelatedListData, { recordId: '$recordId' })
    wiredData({ error, data }) {
        console.log('Record ID:', this.recordId); // Debug statement
        if (data) {
            this.relatedListData = data;
        } else if (error) {
            console.error('Error:', error);
        }
    }*/

    handleSave(event) {
        // Handle save logic
    }

    handleViewAll(event) {
        // Handle view all logic
    }
}