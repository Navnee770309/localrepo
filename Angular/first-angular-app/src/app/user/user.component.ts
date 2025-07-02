import { Component,signal,computed,Input, input,Output,EventEmitter } from '@angular/core';
//import { DUMMY_USERS } from '../../dummy-users';
//const randomIndex=Math.floor(Math.random()*DUMMY_USERS.length);
@Component({
  selector: 'app-user',
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  //This is the way to take input without signals
  @Input() avatar!: string;
  @Input() name!:string;
  @Input() id!:string;
  @Output() select = new EventEmitter();
  //This is a way to take input with signals
  // avatar=input.required<string>();
  // name=input.required<string>();

  //function for signal computation with input
  // imagePath=computed(()=>{
  //   return 'assets/users/'+this.avatar();
  // })
  //selectedUser=signal(DUMMY_USERS[randomIndex]);
  //imagePath=computed(()=>'assets/users/'+this.selectedUser().avatar);

  //functions for signal communication with input
  get imagePath(){
    return "assets/users/"+this.avatar;
  }
  onSelectUser(){
    // const randomIndex=Math.floor(Math.random()*DUMMY_USERS.length);
    // this.selectedUser=DUMMY_USERS[randomIndex];
    //const randomIndex=Math.floor(Math.random()*DUMMY_USERS.length);
    //this.selectedUser.set(DUMMY_USERS[randomIndex]);
    this.select.emit(this.id);
  }
}
