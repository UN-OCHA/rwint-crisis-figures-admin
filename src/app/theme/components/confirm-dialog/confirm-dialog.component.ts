import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent {
  @Input()
  title: string;

  @Input()
  content: string;

  @Input()
  settings?: {
    confirmText?: string;
    confirmStyle?: string;
    dismissText?: string;
    dismissStyle?: string;
  };

  /** Constructor */
  constructor(protected dialogRef: NbDialogRef<ConfirmDialogComponent>) {

  }

  /**
   * Click handler for dialog dismissal button.
   */
  onDismiss() {
    this.dialogRef.close(false);
  }

  /**
   * Click handler for dialog confirmation button.
   */
  onConfirm() {
    this.dialogRef.close(true);
  }
}
