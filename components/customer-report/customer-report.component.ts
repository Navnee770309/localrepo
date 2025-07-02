import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Needed for ngModel on input fields
import { RouterModule, Router } from '@angular/router'; // For header navigation and back button

import { CustomerReportDto, CustomerReportService } from '../../services/customer-report.service';

@Component({
  selector: 'app-customer-report',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule // Important for routerLink
  ],
  templateUrl: './customer-report.component.html',
  styleUrls: ['./customer-report.component.css']
})
export class CustomerReportComponent implements OnInit {

  customerReportIdInput: number | null = null; // For fetching specific report
  displayedReports: CustomerReportDto[] = []; // To display reports (either all or specific)

  errorMessage: string | null = null;
  successMessage: string | null = null; // For general success messages
  isLoading: boolean = false;

  constructor(
    private customerReportService: CustomerReportService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.resetDisplayState(); // Initialize with empty display state
    // Optionally fetch all reports on component load:
    // this.showAllCustomerReports();
  }

  /**
   * Fetches a specific customer report based on the ID entered in the input field.
   */
  fetchSpecificCustomerReport(): void {
    this.errorMessage = null;
    this.successMessage = null;
    this.displayedReports = []; // Clear current display before new fetch

    if (this.customerReportIdInput === null || isNaN(this.customerReportIdInput)) {
      this.errorMessage = 'Please enter a valid Customer ID.';
      return;
    }

    this.isLoading = true;
    this.customerReportService.getCustomerReportById(this.customerReportIdInput).subscribe({
      next: (report: CustomerReportDto) => {
        this.displayedReports = [report]; // Display single report as a card
        this.errorMessage = null;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching specific customer report:', err);
        this.errorMessage = `Failed to load customer report with ID ${this.customerReportIdInput}. Details: ${err.message || 'Unknown error'}`;
        this.isLoading = false;
        this.displayedReports = []; // Clear reports on error
      }
    });
  }

  /**
   * Fetches and displays all available customer reports.
   */
  showAllCustomerReports(): void {
    this.errorMessage = null;
    this.successMessage = null;
    this.customerReportIdInput = null; // Clear specific ID input
    this.displayedReports = []; // Clear specific display before showing all

    this.isLoading = true;
    this.customerReportService.getAllCustomerReports().subscribe({
      next: (reports: CustomerReportDto[]) => {
        this.displayedReports = reports; // Display all reports as cards
        this.isLoading = false;
        this.errorMessage = null;
        if (reports.length === 0) {
          this.errorMessage = 'No customer reports available in the database. Try generating some first.';
        }
      },
      error: (err) => {
        console.error('Error fetching all customer reports:', err);
        this.errorMessage = `Failed to load all customer reports. Details: ${err.message || 'Unknown error'}`;
        this.isLoading = false;
        this.displayedReports = []; // Clear reports on error
      }
    });
  }

  /**
   * Handles the logout action.
   */
  logout(): void {
    console.log('Logging out from Customer Reports...');
    this.router.navigate(['/login']);
  }

  /**
   * Helper method to reset the displayed reports and messages.
   */
  private resetDisplayState(): void {
    this.errorMessage = null;
    this.successMessage = null;
    this.customerReportIdInput = null;
    this.displayedReports = []; // Clears all displayed cards
  }
}
