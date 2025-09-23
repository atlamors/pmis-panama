import { Component, HostBinding, ViewChild, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { heroUser, heroChevronUpDown, heroArrowRightOnRectangle, heroCog6Tooth } from '@ng-icons/heroicons/outline';

type NavItem = {
    id: string;
    label: string;
    icon: string;          // hero icon name, e.g. 'heroHome'
    route?: string;        // router link
    badge?: number;        // optional badge
    dot?: boolean;         // optional status dot
};

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [RouterLink, RouterLinkActive, NgIconComponent, MenuModule],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css'],
    providers: [
        provideIcons({ heroUser, heroChevronUpDown, heroArrowRightOnRectangle, heroCog6Tooth })
    ]
})
export class SidebarComponent {

    constructor(private router: Router) {}
    
    // Sidebar state
    isOpen = true;
    isMenuOpen = false;
    toggle() { this.isOpen = !this.isOpen; }

    // Sidebar css state binding
    @HostBinding('class.open') get openMobile() { return this.isOpen; }
    @HostBinding('class.collapsed') get collapsed() { return !this.isOpen; }

    // Get a handle to the PrimeNG menu component instance
    @ViewChild('accountMenu') accountMenuCmp!: Menu;

    toggleAccountMenu(evt: MouseEvent) {
        evt.stopPropagation();
        this.isMenuOpen = !this.isMenuOpen;
    }
    closeAccountMenu() { this.isMenuOpen = false; }

    @HostListener('document:click')
    onDocClick() { this.closeAccountMenu(); }

    go(path: string) {
        this.closeAccountMenu();
        this.router.navigateByUrl(path);
    }

    // Operators Home Items
    homeItems = [
        { id: 'dash', label: 'Dashboard', icon: 'heroHome', route: '/dashboard' },
        { id: 'bm', label: 'Bookmarks', icon: 'heroBookmark', route: '/bookmarks', badge: 3 },
        { id: 'team', label: 'Team', icon: 'heroUsers', route: '/team' },
        { id: 'msg', label: 'Messages', icon: 'heroEnvelope', route: '/messages', dot: true },
        { id: 'cal', label: 'Calendar', icon: 'heroCalendar', route: '/calendar' },
    ];

    // Canal Ops Items
    canalOps = [
        { id: 'scheduling', label: 'Scheduling', icon: 'heroCalendar', route: '/scheduling' },
        { id: 'locks', label: 'Locks (Placeholder)', icon: 'heroViewfinderCircle', route: '/locks' },
        { id: 'traffic', label: 'Traffic (Placeholder)', icon: 'heroViewfinderCircle', route: '/traffic' },
        { id: 'maintenance', label: 'Maintenance (Placeholder)', icon: 'heroViewfinderCircle', route: '/maintenance' },
        { id: 'weather', label: 'Weather (Placeholder)', icon: 'heroViewfinderCircle', route: '/weather' },
        { id: 'analytics', label: 'Analytics (Placeholder)', icon: 'heroViewfinderCircle', route: '/analytics' },
    ];

    // Account Items
    accountItems: MenuItem[] = [
        { label: 'Profile', icon: 'pi pi-user', routerLink: ['/profile'] },
        { label: 'Settings', icon: 'pi pi-cog', routerLink: ['/settings'] },
        { separator: true },
        { label: 'Sign out', icon: 'pi pi-sign-out', command: () => console.log('sign out') },
    ];
}
