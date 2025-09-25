import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';


/**
 * Left navigation sidebar for feature routes within the Scheduling MFE.
 */
@Component({
    selector: 'scheduling-sidebar',
    standalone: true,
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './sidebar.component.html',
})
export class SidebarComponent {}