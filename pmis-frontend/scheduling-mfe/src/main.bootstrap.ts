import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'mfe-root',
  template: `<div class="p-4 rounded border border-gray-800 bg-gray-900 text-gray-200">Scheduling Remote Ready</div>`
})
class RemoteAppComponent {}

bootstrapApplication(RemoteAppComponent).catch(err => console.error(err));
