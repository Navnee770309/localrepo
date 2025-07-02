import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http'; // Import provideHttpClient for standalone apps

// This is the entry point for your Angular 19 application using standalone components.
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient() // Registers HttpClient for dependency injection across the application
  ]
}).catch(err => console.error(err));