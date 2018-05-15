export class ToDoItem {

  constructor(public Id: number, public Title: string, public Description: string) {
    this.isCompleted = false;
    this.creationDate = new Date();
  }
  creationDate: Date;
  isCompleted: boolean;
  isDeleted: boolean;
  category = 'base';

  public updateToDo(title: string, description: string) {
    this.Title = title;
    this.Description = description;
    alert('update: ' + title + '\n' + description);
  }

}
