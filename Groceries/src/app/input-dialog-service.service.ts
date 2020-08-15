import { Injectable } from '@angular/core';
import { GroceriesServiceService } from './groceries-service.service'
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class InputDialogServiceService {

  constructor(public alertController: AlertController, public dataService: GroceriesServiceService) { }
  // Show Prompt function
  async showPrompt(item?, index?){
    const alert = await this.alertController.create({
      header: item ? 'Edit Item' : 'Add Item',
      message: item? 'Please edit Item name and quantity' : 'Please enter Item name and quantity',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Grocery Item Name',
          value: item ? item.name : null
        },
        {
          name: 'quantity',
          type: 'text',
          placeholder: 'Grocery Item Quantity',
          value: item ? item.quantity : null
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (data) => {
            console.log('Confirm Cancel');
          }
        }, {
          text: index !== undefined ? 'Save' : 'Add',
          handler: (data) => {
            console.log('Confirm Add', item);
            if(index !== undefined){
              item.name = data.name;
              item.quantity = data.quantity;
              this.dataService.editItem(item, index);
            }else{
              this.dataService.addItem(data);
            }
          }
        }
      ]
    });
    await alert.present();
  }

}
