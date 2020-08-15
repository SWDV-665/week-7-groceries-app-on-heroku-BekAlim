import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class GroceriesServiceService {

  groceryItems: any = [];
  dataChanged$: Observable<boolean>;
  private dataChangeSubject: Subject<boolean>;
  rootURL = 'https://g-server-demo.herokuapp.com';

  constructor(public http: HttpClient) { 
    this.dataChangeSubject = new Subject<boolean>();
    this.dataChanged$ = this.dataChangeSubject.asObservable();
   }

  getItems(){
    return this.http.get(`${this.rootURL}/api/groceries`).pipe(
      map(this.getData),
      catchError(this.errorHandler)
    );
  }

  removeItem(groceryItem, index){
    this.http.delete(`${this.rootURL}/api/groceries/${groceryItem._id}`).subscribe(
      res => {
        this.groceryItems = res;
        this.dataChangeSubject.next(true);
      }
    );
  }

  addItem(item){
    console.log(item);
    this.http.post(`${this.rootURL}/api/groceries/`, item).subscribe(
      res => {
        this.groceryItems = res;
        this.dataChangeSubject.next(true);
      }
    );
  }

  editItem(item, index){
    console.log(item._id);
    console.log(item.name);
    this.http.put(`${this.rootURL}/api/groceries/${item._id}`, item).subscribe(
      res => {
        this.groceryItems[index] = res;
        this.dataChangeSubject.next(true);
      }
    );
  }

  private getData(res: Response){
    let body = res;
    return body || {};
  }
  private errorHandler(error: Response|any){
    let errorMessage: string;
    if(error instanceof Response){
      const err = error || '';
      errorMessage = `${error.status} - ${error.statusText || ''} ${err}`;
    }else{
      errorMessage = error.message ? error.message : error.toString();
    }
    console.log(errorMessage);
    return Observable.throw(errorMessage);
  }
}
