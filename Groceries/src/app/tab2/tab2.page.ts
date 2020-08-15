import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { GroceriesServiceService } from '../groceries-service.service';
import { InputDialogServiceService } from '../input-dialog-service.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  // Variables
  titleOfPage = "Grocery List"
  groceryItems: any = [];
  errorMessage: string;
  // Constructor 
  constructor(
    public toastController: ToastController, 
    public alertController: AlertController, 
    public dataService: GroceriesServiceService,
    public inputDialogService: InputDialogServiceService,
    private socialSharing: SocialSharing
    ) {
      dataService.dataChanged$.subscribe((dataChanged:boolean)=>{this.loadGroceryItems();});
    }
  
  ngOnInit(){
    this.loadGroceryItems();
  }
  // Load Grocery Items
  loadGroceryItems(){
    this.dataService.getItems()
      .subscribe(
        groceryItems => this.groceryItems = groceryItems,
        error => this.errorMessage = <any>error
      );
  }

  // Remove grocery function
  async removeGroceryItem(groceryItem, index){
    const toast = await this.toastController.create({
      message: `You have removed: ${groceryItem.name}`,
      duration: 2000
    });
    toast.present();
    this.dataService.removeItem(groceryItem, index);
  }

  // Share grocery function
  async shareGroceryItem(groceryItem, index){
    const toast = await this.toastController.create({
      message: `Sharing item: ${groceryItem.name}`,
      duration: 2000
    });
    toast.present();

    let message = `Grocery Item - Name: ${groceryItem.name} - Quantity: ${groceryItem.quantity}`;
    let subject = "Shared via Groceries app";
    this.socialSharing.share(message, subject).then(() => {
      console.log("Shared!");
    }).catch(() => {
      console.error("Not Shared!");
    });
    
  }

  // Edit grocery function
  async editGroceryItem(groceryItem, index){
    const toast = await this.toastController.create({
      message: `You are editing: ${groceryItem.name}`,
      duration: 2000
    });
    toast.present();
    this.inputDialogService.showPrompt(groceryItem, index);
  }

  // Add grocery function
  async addGroceryItem(){
    this.inputDialogService.showPrompt();
  }

  // End Class
}
