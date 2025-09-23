import { Component } from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [NgIconComponent],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
})
export class HeaderComponent { }
