import { LightningElement } from 'lwc';

export default class DataBinding extends LightningElement {

    firstname='Juturu sivakumar';
 // Object based on we will do it "Name based"
    person={
        name :'juturuSivakumar',
        age:25,
        Address:
        {
            city:'Hyderabad',
            State:'Telangana'
        }
    }
 // Array based data we will do it "Index Based"

  fruits =['Apple','Banana', 'Orange','Mango'];
 
 // Use array show data in UI level Getter method..
     get fruit(){
        return this.fruits[0];
     }

     handlechange(event){
       this.firstname = event.target.value;

     }
}