import { Component } from '@angular/core';

@Component({
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent {
  list: any[] = [];

  name = '';
  checked = false;

  constructor() {
    setTimeout(() => {
      this.checked = true;
      this.name = 'name';
      this.list = [{
        text: 'aaa',
        value: 'a'
      }, {
        text: 'bbb',
        value: 'b'
      }, {
        text: 'ccc',
        value: 'c'
      }];
    }, 2000);
  }

  submit() {
    alert(333);
  }
}