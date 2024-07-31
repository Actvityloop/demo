import { LightningElement } from 'lwc';

export default class FormBuilderDraggable extends LightningElement {
    handleDragStart(event) {
        event.dataTransfer.setData('fieldType', event.target.dataset.type);
    }
}