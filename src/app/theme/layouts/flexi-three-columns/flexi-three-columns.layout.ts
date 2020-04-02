import { Component, Input, OnInit } from '@angular/core';

/**
 * A three-column layout with the third column acting as a drawer.
 */
@Component({
  selector: 'ngx-flexi-three-columns-layout',
  styleUrls: ['./flexi-three-columns.layout.scss'],
  template: `
    <div class="row">
      <div [ngClass]="isOpen ? 'col-4' : 'col-6'">
        <ng-content select=".column-1"></ng-content>
      </div>
      <div [ngClass]="isOpen ? 'col-4' : 'col-6'">
        <ng-content select=".column-2"></ng-content>
      </div>
      <div *ngIf="canShowDrawer" [ngClass]="isOpen ? 'col-4 open-panel' : 'closed-panel'" class="">
        <ng-content select=".column-3"></ng-content>
      </div>
    </div>
  `,
})
export class FlexiThreeColumnsLayoutComponent implements OnInit {

  /** Control drawer state */
  @Input()
  isOpen: boolean = false;

  /** Determine whether to render the drawer panel */
  canShowDrawer: boolean = false;

  /** @override */
  ngOnInit(): void {
    setTimeout(() => {
    	this.canShowDrawer = true;
    });
  }
}
