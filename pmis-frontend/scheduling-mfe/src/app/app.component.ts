import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { FooterComponent } from './layout/footer/footer.component';

/**
 * Root shell component for the Scheduling MFE.
 * Hosts header, sidebar, footer, and the routed content via `RouterOutlet`.
 */
@Component({
    selector: 'scheduling-root',
    standalone: true,
    imports: [RouterOutlet, HeaderComponent, SidebarComponent, FooterComponent],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent {}