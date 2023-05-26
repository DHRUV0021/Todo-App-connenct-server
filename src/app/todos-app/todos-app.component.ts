import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CrudsService, TaskIteams, TodosApp } from '../cruds.service';

@Component({
  selector: 'app-todos-app',
  templateUrl: './todos-app.component.html',
  styleUrls: ['./todos-app.component.scss'],
})

export class TODOSAPPComponent {
  Task?: TodosApp;
  newItemAdd: TaskIteams;
  allList: Array<TodosApp> = new Array<TodosApp>();
  updateAddBtn: boolean = false;
  clearBtn: boolean = false;
  addNewListItemBtn: boolean = false;
  searchValue: String;
  addBtntodo = false;
  oneAdd = false;
  // card new data ADD
  showInputField: boolean = false;

  constructor(private Data: CrudsService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.Task = new TodosApp;
    this.Task.tasks = new Array<TaskIteams>();
    this.newItemAdd = new TaskIteams;
    this.addBlankItem();
    this.getData();
  }

  //DYNAMIC ADD ROW
  addBlankItem() {
    this.Task.tasks.push(new TaskIteams());
  }

  removeBlankitem(i) {
    if (this.Task.tasks.length != 1) {
      this.Task.tasks.splice(i, 1);
    }
  }

  //=================GET DATA METHOD
  getData() {
    this.Data.getItem().subscribe({
      next: (res) => {
        this.allList = res;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log("data get success");
      }
    })
  }


  //=================ADD DATA METHOD
  AddData() {
    if (this.Task.name) {
      this.Data.AddItem(this.Task).subscribe({
        next: (res) => {
          console.log(res);
          this.getData();
          this.Task = new TodosApp;
          this.addBlankItem();
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          console.log("success full");
        }
      })
    }
    else {
      this.toastr.warning('plese enter your task');
    }
  }

  //=================ADD DATA METHOD API


  addNewItemFill(data) {
    this.addNewListItemBtn = true;
    this.Task = data;
  }

  addFinalyItemData(id) {

    this.newItemAdd.todoId = id;
    let data = this.newItemAdd;
    this.addNewListItemBtn = false;
    
    this.Data.addInnerListData(id, data).subscribe({
      next: (res) => {
        console.log(res);
        this.getData();
      },
      error: (err) => {
        console.log(err);
      }
    })
  }


  //=================EDIT DATA METHOD
  fillData(Data: TodosApp) {
    this.Task = Data;
    this.updateAddBtn = true;
  }

  editData() {
    this.Data.editItem(this.Task).subscribe({
      next: (res) => {
        this.editInnerlist(this.Task.id);
        this.addBlankItem();
        this.Task = new TodosApp;
        this.updateAddBtn = false;
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log("EDIT DATA");
      }
    })
  }

  //=================EDIT DATA METHOD API
  editInnerlist(TodoId) {
    this.Task.tasks.forEach(element => {
      this.Data.editInnerListData(TodoId, element).subscribe({
        next: (res) => {
          console.log(res);
          this.updateAddBtn = false;
          this.Task = new TodosApp;
          this.getData();
          this.addBlankItem();
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          console.log("edit task item");
        }
      });
    });
  }


  //=================DELETE DATA METHOD
  deleteData(Data: TodosApp) {
    this.Data.deleteItem(Data).subscribe({
      next: (res) => {
        console.log(res);
        this.getData();
        this.toastr.success('Task Deleted Syccessfully');
      },
      error: (err) => {
        console.log(err);
      },
    })
  }

  //=================DELETE DATA METHOD API
  deleteInnerList(TodoId, body) {
    this.Data.deleteInnerListData(TodoId, body).subscribe({
      next: (res) => {
        console.log(res);
        this.getData();
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log("delete new list Item");
      }
    })
  }


  //================= SEARCH DATA METHOD
  typeSearchData() {
    if (this.searchValue) {
      let searchEmploye = new Array<TodosApp>();
      if (this.allList.length > 0) {
        for (let emp of this.allList) {
          if (JSON.stringify(emp).toLowerCase().indexOf(this.searchValue.toLowerCase()) > 0) {
            searchEmploye.push(emp)
          }
        }
        this.allList = searchEmploye;
      }
      else {
        this.getData();
      }
    }
    else {
      this.getData();
    }
  }


  //================= EDIT CLEAR FILD DATA METHOD
  editclear() {
    this.Task = new TodosApp;
    this.clearBtn = true;
    this.updateAddBtn = false;
    this.addNewListItemBtn = false;
    this.addBlankItem();
  }

  // card new data ADD
  toggleInputField(item) {
    if (!this.showInputField) {
      item.isInput = true;
    }
  }
} 