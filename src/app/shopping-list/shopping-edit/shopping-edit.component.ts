import { Component, OnDestroy, OnInit, ViewChild} from '@angular/core';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') slForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItemIndex : number;
  editedItem : Ingredient;

  constructor(private slService: ShoppingListService) {}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.subscription = this.slService.startedEditing
    .subscribe((index:number)=>{
      this.editedItemIndex= index;
      this.editMode= true;
      this.editedItem= this.slService.getIngredient(index);
      this.slForm.setValue({
        name: this.editedItem.name,
        amount:this.editedItem.amount
      })
    });
  }

  onSubmit(form: NgForm) {
    const newIngredient = new Ingredient(form.value.name, form.value.amount);
    if(this.editMode){
      this.slService.updateIngredientsChanged(this.editedItemIndex,newIngredient);
    }else{
      this.slService.addIngredient(newIngredient);
    }
    this.editMode=false;
    form.reset();
  }

  onClear(){
    this.slForm.reset();
    this.editMode=false;
  }

  onDelete(){
    this.slService.deleteIngredients(this.editedItemIndex);
    this.onClear();
  }
}
