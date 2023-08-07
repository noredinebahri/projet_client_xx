import {Component} from '@angular/core';

@Component({
  selector: 'psm-not-found-dialog',
  template: `
    <h3>Unbekannte Seite...</h3>
    <a routerLink="/">Zur Home-Seite</a>
  `,
  styleUrls: ['./not-found-dialog.component.scss']
})
export class NotFoundDialogComponent {
}
