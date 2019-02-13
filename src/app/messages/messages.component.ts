import { Component, OnInit } from '@angular/core';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  constructor(public messageService: MessageService) { }
  msg: string = '';
  ngOnInit() {
  }
  setMsg(): void {
  	if(this.msg !='') this.messageService.add(this.msg);
  	this.msg = '';
  }
}
