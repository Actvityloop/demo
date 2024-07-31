import { LightningElement, wire, track } from 'lwc';
import getFieldSetValues from '@salesforce/apex/FieldSetController.getFieldSetValues';
import saveFieldSetValues from '@salesforce/apex/FieldSetController.saveFieldSetValues';  // Import the save method

export default class FieldSetDisplay extends LightningElement {
    @track sections = [{ id: 1, fieldSetValues: [] }];  // Initialize with one section and an ID
    @track isDataDirty = false; // Track if data has been changed
    @track showNewComponent = false;

    

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