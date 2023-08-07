import {Component, Input} from '@angular/core';

@Component({
  selector: 'psm-dialog-icon',
  templateUrl: './dialog-icon.component.html',
  styleUrls: ['./dialog-icon.component.scss']
})
export class DialogIconComponent{
  @Input()
  name: string | undefined;
}
