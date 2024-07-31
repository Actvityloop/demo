import { LightningElement, api, wire, track } from 'lwc';
import getRelatedListData from '@salesforce/apex/RelatedListController.getRelatedListData';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getFieldSetValues from '@salesforce/apex/FieldSetController.getFieldSetValues';
import saveFieldSetValues from '@salesforce/apex/FieldSetController.saveFieldSetValues';  // Import the save method


export default class RelatedListData extends LightningElement {
@api recordId;
@track relatedListData;
@track columns = [];
@track draftValues = [];
@ track showNewComponent= false;
// Fetch related list data using Apex
 fieldTypes = {}; // Initialize fieldTypes
    picklistValues = {}; // Initialize picklist values
     @track sections = [{ id: 1, fieldSetValues: [] }];  // Initialize with one section and an ID
    @track isDataDirty = false; // Track if data has been changed

    // Fetch related list data using Apex
    @wire(getRelatedListData, { recordId: '$recordId' })
    wiredRelatedListData({ error, data }) {
        if (data) {
            this.relatedListData = data.records || [];
            this.fieldTypes = data.fieldTypes || {};
            this.picklistValues = data.picklistValues || {};
            this.updateColumns();
        } else if (error) {
            this.relatedListData = [];
            this.fieldTypes = {};
            this.picklistValues = {};
            console.error('Error fetching related list data: ', error);
        }
    }

    // Update columns dynamically based on fetched fields
    updateColumns() {
        if (this.relatedListData.length > 0) {
            this.columns = Object.keys(this.relatedListData[0]).map(field => ({
                label: field.replace(/__c/g, '').replace(/_/g, ' '), // Adjust the label
                fieldName: field,
                type: this.getFieldType(field), // Determine field type dynamically
                editable: true,
                typeAttributes: this.getFieldTypeAttributes(field) // Set typeAttributes for picklists
            }));
        }
    }

    // Determine field type dynamically
    getFieldType(field) {
        const fieldType = this.fieldTypes[field];
        switch (fieldType) {
            case 'STRING':
            case 'TEXTAREA':
                return 'text';
            case 'PICKLIST':
                return 'picklist';
            case 'MULTIPICKLIST':
                return 'multiselect';
            case 'BOOLEAN':
                return 'boolean';
            case 'CURRENCY':
                return 'currency';
            case 'DATE':
                return 'date';
            case 'DATETIME':
                return 'datetime';
            case 'EMAIL':
                return 'email';
            case 'NUMBER':
                return 'number';
            case 'PERCENT':
                return 'percent';
            case 'PHONE':
                return 'phone';
            case 'URL':
                return 'url';
            default:
                return 'text'; // Default to text type
        }
    }

    // Set typeAttributes for picklists
    getFieldTypeAttributes(field) {
        const fieldType = this.fieldTypes[field];
        comnsole.log('fieldType'+fieldType);
        if (fieldType === 'Picklist') {
            return {
                placeholder: 'Choose an option',
                options: this.getPicklistOptions(field)
            };
        } else if (fieldType === 'MultiPicklist') {
            return {
                placeholder: 'Choose options',
                options: this.getPicklistOptions(field)
            };
        } else {
            return undefined;
        }
    }

    getPicklistOptions(field) {
        const values = this.picklistValues[field] || [];
        return values.map(value => ({ label: value, value }));
    }


    /// Here Add Button Concept like add Button Conecpt........................................................

    handleClick(){
        this.showNewComponent= true;
    }
     @wire(getFieldSetValues)
    wiredFieldSetValues({ error, data }) {
        if (data) {
            const fieldSetValues = data.map(field => {
                return {
                    ...field,
                    value: '', // Initialize field value
                    isPicklist: field.type === 'Picklist',
                    isMultiPicklist: field.type === 'MultiPicklist',
                    isTextarea: field.type === 'Textarea',
                    isCheckbox: field.type === 'Checkbox',
                    isPercent: field.type === 'Percent',
                    isText: field.type === 'Text',
                    isNumber: field.type === 'Number',
                    isPhone: field.type === 'Phone',
                    isEmail: field.type === 'Email',
                    isDate: field.type === 'Date',
                    isDateTime: field.type === 'DateTime',
                    isCurrency: field.type === 'Currency',
                    isTime: field.type === 'Time',
                    isURL: field.type === 'URL',
                    isRichTextArea: field.type === 'RichTextArea',
                    selectedValues: field.type === 'MultiPicklist' ? [] : null // Initialize selectedValues for MultiPicklist
                };
            });

            // Set field values for the first section
            this.sections = [{
                id: 1,
                fieldSetValues: fieldSetValues.map(field => ({
                    ...field,
                    selectedValues: field.type === 'MultiPicklist' ? [] : null // Initialize selectedValues for MultiPicklist
                }))
            }];
        } else if (error) {
            console.error('Error fetching field set values', error);
        }
    }

    handleMultiPicklistChange(event) {
        const fieldName = event.target.name;
        const selectedValues = event.detail.value;

        // Update selected values for MultiPicklist fields across all sections
        this.sections = this.sections.map(section => {
            return {
                ...section,
                fieldSetValues: section.fieldSetValues.map(field => {
                    if (field.fieldName === fieldName) {
                        return { ...field, selectedValues };
                    }
                    return field;
                })
            };
        });
        this.isDataDirty = true; // Mark data as changed
    }

    handleFieldChange(event) {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;

        // Update field values across all sections
        this.sections = this.sections.map(section => {
            return {
                ...section,
                fieldSetValues: section.fieldSetValues.map(field => {
                    if (field.fieldName === fieldName) {
                        return { ...field, value: fieldValue };
                    }
                    return field;
                })
            };
        });
        this.isDataDirty = true; // Mark data as changed
    }

    handleAddSection() {
        // Add a new section with the same field set values
        const newSectionId = this.sections.length + 1;
        this.sections = [...this.sections, {
            id: newSectionId,
            fieldSetValues: this.sections[0].fieldSetValues.map(field => ({
                ...field,
                value: '', // Initialize field value
                selectedValues: field.type === 'MultiPicklist' ? [] : null // Initialize selectedValues for MultiPicklist
            }))
        }];
        this.isDataDirty = true; // Mark data as changed
    }

    handleSave() {
        if (this.isDataDirty) {
            // Process the saved data, e.g., send it to the server
            saveFieldSetValues({ sections: this.sections })
                .then(() => {
                    // Handle successful save
                    console.log('Data saved successfully');
                    this.isDataDirty = false; // Reset the dirty flag
                })
                .catch(error => {
                    // Handle save errors
                    console.error('Error saving data', error);
                });
        } else {
            console.log('No changes to save.');
        }
    }

    handleCancel() {
        if (this.isDataDirty) {
            if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
                this.loadInitialData(); // Reload initial data
                this.isDataDirty = false; // Reset the dirty flag
            }
        } else {
            this.loadInitialData(); // Reload initial data
        }
    }

    // Load initial data into sections
    loadInitialData() {
        // Load your initial data here
        // Example:
        getFieldSetValues()
            .then(data => {
                const fieldSetValues = data.map(field => {
                    return {
                        ...field,
                        isPicklist: field.type === 'Picklist',
                        isMultiPicklist: field.type === 'MultiPicklist',
                        isTextarea: field.type === 'Textarea',
                        isCheckbox: field.type === 'Checkbox',
                        isPercent: field.type === 'Percent',
                        isText: field.type === 'Text',
                        isNumber: field.type === 'Number',
                        isPhone: field.type === 'Phone',
                        isEmail: field.type === 'Email',
                        isDate: field.type === 'Date',
                        isDateTime: field.type === 'DateTime',
                        isCurrency: field.type === 'Currency',
                        isTime: field.type === 'Time',
                        isURL: field.type === 'URL',
                        isRichTextArea: field.type === 'RichTextArea',
                        selectedValues: field.type === 'MultiPicklist' ? [] : null // Initialize selectedValues for MultiPicklist
                    };
                });

                this.sections = [{
                    id: 1,
                    fieldSetValues: fieldSetValues.map(field => ({
                        ...field,
                        selectedValues: field.type === 'MultiPicklist' ? [] : null // Initialize selectedValues for MultiPicklist
                    }))
                }];
            })
            .catch(error => {
                console.error('Error fetching field set values', error);
            });
    }
    handleOpenNewComponent() {
        this.showNewComponent = true;
    }
}