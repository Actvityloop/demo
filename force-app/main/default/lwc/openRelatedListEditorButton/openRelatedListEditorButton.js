import { LightningElement, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';

export default class ParentComponent extends LightningElement {
    recordId;

    // Wire CurrentPageReference to get the recordId
    @wire(CurrentPageReference)
    setCurrentPageReference(currentPageReference) {
        this.recordId = currentPageReference.state.recordId;
    }
}