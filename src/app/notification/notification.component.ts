import { Component, OnInit, ViewEncapsulation } from '@angular/core';

export interface ListItem {
  text: string;
}

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NotificationComponent implements OnInit {
  isButtonVisible = false;
  constructor() { }
  notification = [
    {
      id: 1, name: 'Item 1', isVisible: false, items: [
        { hq: 'Ahmedabad', varMonth1: '90%', varMonth2: '100%', varMonth3: '95%' },
        { hq: 'Baroda', varMonth1: '90%', varMonth2: '100%', varMonth3: '95%' }
      ], varDate: '01-July-2023', ach: '89%', read: false
    },
    {
      id: 2, name: 'Item 2', isVisible: false, items: [
        { hq: 'Ahmedabad', varMonth1: '90%', varMonth2: '100%', varMonth3: '95%' },
        { hq: 'Baroda', varMonth1: '90%', varMonth2: '100%', varMonth3: '95%' }
      ], varDate: '02-July-2023', ach: '89%', read: true
    },
    {
      id: 3, name: 'Item 3', isVisible: false, items: [
        { hq: 'Ahmedabad', varMonth1: '90%', varMonth2: '100%', varMonth3: '95%' },
        { hq: 'Baroda', varMonth1: '90%', varMonth2: '100%', varMonth3: '95%' }
      ], varDate: '03-July-2023', ach: '89%', read: false
    },
    {
      id: 4, name: 'Item 4', isVisible: false, items: [
        { hq: 'Ahmedabad', varMonth1: '90%', varMonth2: '100%', varMonth3: '95%' },
        { hq: 'Baroda', varMonth1: '90%', varMonth2: '100%', varMonth3: '95%' }
      ], varDate: '04-July-2023', ach: '89%', read: false
    },
    {
      id: 5, name: 'Item 5', isVisible: false, items: [
        { hq: 'Ahmedabad', varMonth1: '90%', varMonth2: '100%', varMonth3: '95%' },
        { hq: 'Baroda', varMonth1: '90%', varMonth2: '100%', varMonth3: '95%' }
      ], varDate: '05-July-2023', ach: '89%', read: false
    },
    {
      id: 6, name: 'Item 6', isVisible: false, items: [
        { hq: 'Ahmedabad', varMonth1: '90%', varMonth2: '100%', varMonth3: '95%' },
        { hq: 'Baroda', varMonth1: '90%', varMonth2: '100%', varMonth3: '95%' }
      ], varDate: '06-July-2023', ach: '89%', read: false
    },
    {
      id: 7, name: 'Item 7', isVisible: false, items: [
        { hq: 'Ahmedabad', varMonth1: '90%', varMonth2: '100%', varMonth3: '95%' },
        { hq: 'Baroda', varMonth1: '90%', varMonth2: '100%', varMonth3: '95%' }
      ], varDate: '07-July-2023', ach: '89%', read: false
    },
    {
      id: 8, name: 'Item 8', isVisible: false, items: [
        { hq: 'Ahmedabad', varMonth1: '90%', varMonth2: '100%', varMonth3: '95%' },
        { hq: 'Baroda', varMonth1: '90%', varMonth2: '100%', varMonth3: '95%' }
      ], varDate: '02-July-2023', ach: '89%', read: false
    },
    {
      id: 9, name: 'Item 9', isVisible: false, items: [
        { hq: 'Ahmedabad', varMonth1: '90%', varMonth2: '100%', varMonth3: '95%' },
        { hq: 'Baroda', varMonth1: '90%', varMonth2: '100%', varMonth3: '95%' }
      ], varDate: '02-July-2023', ach: '89%', read: false
    },
    {
      id: 10, name: 'Item 10', isVisible: false, items: [
        { hq: 'Ahmedabad', varMonth1: '90%', varMonth2: '100%', varMonth3: '95%' },
        { hq: 'Baroda', varMonth1: '90%', varMonth2: '100%', varMonth3: '95%' }
      ], varDate: '02-July-2023', ach: '89%', read: false
    },
  ];
  items: ListItem[] = [
    { text: 'Item 1' },
    { text: 'Item 2' },
    { text: 'Item 3' },
    { text: 'Item 4' },
    // Add more items as needed
  ];

  action = (a) => {
    console.log(a);
    alert(1);
  };

  clickOnItem = (a) => {
    console.log('Click on item');
    
  }

  swipeCallback = (a) => {
    console.log('Callback Swipe', a);
  }
  ngOnInit() {
  }
  toggleVisibility(item): void {
    item.isVisible = !item.isVisible;
  }
}
