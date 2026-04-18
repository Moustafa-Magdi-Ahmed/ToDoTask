import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../task';
import { FormsModule } from '@angular/forms';
import { Task } from '../models/interfaceTask';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-tasks',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks implements OnInit {
  showPopup = false;
  taskName = '';
  showError = false;
  isListSelected=false;
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  listSelected = '';
  listShowed='';
  isClicked=false;
  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });
  get name() {
    return this.form.get('name');
  }

  constructor(public taskService: TaskService) {}
  togglePopup() {
    this.showPopup = !this.showPopup;
    this.showError = false;
  }
  
  ngOnInit() {

  this.taskService.selectedList$.subscribe(list => {
    this.listShowed = list;
    this.filterTasks();
  });
  
  this.taskService.getApiTasks().subscribe((data: Task[]) => {
    console.log('API Response:', data); 
    
    this.tasks = data; 
    this.taskService.tasks = data; 
    
    this.taskService.showList('All Tasks');
  });
}
  selectList(listTask: string) {
    console.log(listTask);
    this.listSelected = listTask;
    this.isListSelected = true;
  }
  addTasks() {
    if (!this.taskName.trim()) {
      this.showError = true;
    } else {
      const newTask: Task = {
        id: this.taskService.id,
        userId: 1, // I will make this dynamic later
        title: this.taskName,
        completed: false,
        listForTask: this.listSelected,
      };
      this.taskService.addTask(newTask);
      this.filteredTasks = [...this.taskService.tasks];
      this.taskService.id++;
      this.taskName = '';
      this.showPopup = false;
      this.listSelected = '';
      this.isClicked=true;
        setTimeout(() => {
    this.isClicked = false;
  }, 2000);
    }
  }

  get lists() {
    return this.taskService.lists;
  }
  closePopUp() {
    this.showPopup = !this.showPopup;
    this.taskName='';
  }
  filterTasks() {
  if (this.listShowed === 'All Tasks') {
    this.filteredTasks = this.taskService.tasks;
  } else {
    this.filteredTasks = this.taskService.tasks
      .filter(task => task.listForTask === this.listShowed);
  }
}
onCheckboxChange(task: Task, event: Event) {
  const checkbox = event.target as HTMLInputElement;
  task.completed = checkbox.checked;

  console.log("Updated task:", task);
}


//  get selectedList() {
//   return this.taskService.selectedList || 'List';
// }
}
