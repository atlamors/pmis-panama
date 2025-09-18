import { Component } from '@angular/core';
import { Routes } from '@angular/router';

@Component({
	standalone: true,
	selector: 'scheduling-remote-entry',
	template: `<div class="p-4 rounded border border-gray-800 bg-gray-900 text-gray-200">Scheduling Remote Ready</div>`
})
export class SchedulingRemoteEntryComponent {}

export const RemoteRoutes: Routes = [
    { path: '', component: SchedulingRemoteEntryComponent }
  ];