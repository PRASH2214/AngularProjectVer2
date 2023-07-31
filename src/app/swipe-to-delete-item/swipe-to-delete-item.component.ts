import { CdkDragEnd, CdkDragExit } from '@angular/cdk/drag-drop';
import { Component, OnInit,Input  } from '@angular/core';

@Component({
  selector: 'app-swipe-to-delete-item',
  templateUrl: './swipe-to-delete-item.component.html',
  styleUrls: ['./swipe-to-delete-item.component.css']
})
export class SwipeToDeleteItemComponent implements OnInit {

  @Input() item: any; // Your item model/interface, adjust the type accordingly

  private dragging = false;
  showDeleteButton = false;

  onDragStart() {
    this.dragging = true;
  }
  ngOnInit() {
    
  }
  onDragEnd(event: CdkDragEnd) {
    this.dragging = false;
    this.showDeleteButton = false;
  }

  onDragExited(event: CdkDragExit) {
    if (this.dragging) {
      this.showDeleteButton = true;
    }
  }

  onDelete() {
    // Handle the delete functionality here, e.g., emit an event to delete the item
    console.log('Delete item:', this.item);
  }

}
