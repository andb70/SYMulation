import { Component } from '@angular/core';
import { StyRepoService } from '../sty-repo.service';
import { Category } from '../models/category';

@Component({
  selector: 'app-category-selector',
  templateUrl: './category-selector.component.html',
  styleUrls: ['./category-selector.component.css']
})
export class CategorySelectorComponent {
  category: Category;
  catName: string;
  styleName: string;
  styleValue: string;
  constructor(private styles: StyRepoService) { }
  getCategories(): Category[] {
    let categories = this.styles.getCategories()
    if (categories) {
      return categories;
    }
    return [];
  }
  addCategory() {
    this.category = new Category(this.styles.getNextid(), this.catName);
    this.styles.insert(this.category);
  }
  addStyle() {
    this.category.addStyle(this.styleName, this.styleValue);
    this.styles.update(this.category);
  }
  delete() {
    this.styles.delete(this.category.id);
  }
}
