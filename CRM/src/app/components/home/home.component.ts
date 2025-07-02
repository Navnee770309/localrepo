import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // Import Router and RouterModule for navigation

@Component({
  selector: 'app-home', // The selector to use this component in other templates
  standalone: true,     // Marks this component as standalone (no NgModule needed)
  imports: [
    CommonModule,     // Provides common directives like NgIf, NgFor
    RouterModule      // Provides routerLink directive for navigation
  ],
  templateUrl: './home.component.html', // Links to the HTML template
  styleUrls: ['./home.component.css']  // Links to the CSS stylesheet
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) { } // Inject the Router service for programmatic navigation

  ngOnInit(): void {
    // This method is called once when the component is initialized.
    // You can add any initialization logic here, like fetching data.
    
  }

  // Example method for navigation if you had a button that didn't use routerLink directly
  // goToDashboard(): void {
  //   this.router.navigate(['/dashboard']);
  // }

  // goToLogin(): void {
  //   this.router.navigate(['/login']);
  // }
}
