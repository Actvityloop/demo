import { LightningElement, wire } from 'lwc';
import getAccountContactOpportunity from '@salesforce/apex/AccountContactOpportunityController.getaccounts';

const columns = [
    { label: 'Account Name', fieldName: 'Name' },
    { label: 'Contact Names', fieldName: 'Contacts' },
    { label: 'Opportunity Names', fieldName: 'Opportunities' }
];

export default class AccountContactOpportunityTable extends LightningElement {
    columns = columns;
    accounts = [];

    @wire(getAccountContactOpportunity)
    wiredAccounts({ error, data }) {
        if (data) {
            this.accounts = data.map(account => ({
                ...account,
                Contacts: account.Contacts ? account.Contacts.map(contact => contact.Name).join(', ') : '',
                Opportunities: account.Opportunities ? account.Opportunities.map(opp => opp.Name).join(', ') : ''
            }));
        } else if (error) {
            console.error(error);
        }
    }
}