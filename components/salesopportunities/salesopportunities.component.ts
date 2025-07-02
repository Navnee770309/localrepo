import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { SalesOpportunityDto, SalesOpportunityResponseDto, SalesOpportunityService } from '../../services/salesopportunities.service';
import { Router,RouterModule } from '@angular/router';
@Component({
  selector: 'app-sales-opportunities',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './salesopportunities.component.html',
  styleUrls: ['./salesopportunities.component.css']
})
export class SalesOpportunitiesComponent implements OnInit {
  @ViewChild('opportunityForm') opportunityForm!: NgForm;

  opportunity: SalesOpportunityDto = {
    name: '',
    stage: 'Prospecting', // Default stage
    amount: null,
    closeDate: null,
    leadSource: '',
    notes: null
  };

  opportunityIdInput: number | null = null; // For fetching specific opportunity
  displayedOpportunities: SalesOpportunityResponseDto[] = []; // For displaying search results (specific or all)

  errorMessage: string | null = null;
  successMessage: string | null = null;
  isLoading: boolean = false;

  // Define possible stages for the dropdown
  opportunityStages: string[] = [
    'Prospecting', 'Qualification', 'Needs Analysis', 'Value Proposition',
    'Decision Makers', 'Perception Analysis', 'Proposal/Price Quote',
    'Negotiation/Review', 'Closed Won', 'Closed Lost'
  ];

  constructor(
    private salesOpportunityService: SalesOpportunityService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.resetDisplayState(); // Clear display tables initially
  }

  /**
   * Handles form submission for creating a new sales opportunity.
   */
  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null; // Clear previous success messages

    if (this.opportunityForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      Object.keys(this.opportunityForm.controls).forEach(field => {
        const control = this.opportunityForm.controls[field];
        control.markAsTouched({ onlySelf: true });
      });
      return;
    }

    this.isLoading = true;
    const opportunityToCreate = { ...this.opportunity };
    // Backend's SalesOpportunityDto doesn't expect 'id' for creation, so no need to delete.
    // Ensure amount is not null if required by backend validation.
    if (opportunityToCreate.amount === null) {
      opportunityToCreate.amount = 0; // Default to 0 if not provided
    }
    // Convert closeDate to ISO string if it's a Date object (though NgModel with type=date handles strings well)
    // If you're using Date objects, you'd convert here: opportunityToCreate.closeDate = this.opportunity.closeDate?.toISOString().split('T')[0] || null;

    this.salesOpportunityService.createSalesOpportunity(opportunityToCreate).subscribe({
      next: (newOpportunity: SalesOpportunityResponseDto) => {
        alert(`Sales Opportunity '${newOpportunity.name}' (ID: ${newOpportunity.id}) added successfully!`);
        this.resetForm(); // Reset form and display states
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error creating sales opportunity:', err);
        this.errorMessage = `Failed to add sales opportunity: ${err.error?.message || 'An unexpected error occurred. Check console.'}`;
        this.isLoading = false;
      }
    });
  }

  /**
   * Fetches a specific sales opportunity based on the input ID.
   */
  fetchOpportunityFromInput(): void {
    this.errorMessage = null;
    this.successMessage = null;
    this.displayedOpportunities = []; // Clear current display before new fetch

    if (this.opportunityIdInput === null || isNaN(this.opportunityIdInput)) {
      this.errorMessage = 'Please enter a valid Sales Opportunity ID.';
      return;
    }

    this.isLoading = true;
    this.salesOpportunityService.getSalesOpportunityById(this.opportunityIdInput).subscribe({
      next: (opportunity: SalesOpportunityResponseDto | null) => {
        if (opportunity) {
          this.displayedOpportunities = [opportunity]; // Display single opportunity as a card
          this.errorMessage = null;
        } else {
          this.errorMessage = `Sales Opportunity with ID ${this.opportunityIdInput} not found.`;
          this.displayedOpportunities = [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching specific sales opportunity:', err);
        this.errorMessage = `Failed to load sales opportunity with ID ${this.opportunityIdInput}. Check backend/console. Details: ${err.message || 'Unknown error'}`;
        this.isLoading = false;
        this.displayedOpportunities = [];
      }
    });
  }

  /**
   * Fetches and displays all sales opportunities.
   */
  showAllOpportunities(): void {
    this.errorMessage = null;
    this.successMessage = null;
    this.opportunityIdInput = null; // Clear specific ID input
    this.displayedOpportunities = []; // Clear specific display before showing all

    this.isLoading = true;
    this.salesOpportunityService.getAllSalesOpportunities().subscribe({
      next: (opportunities: SalesOpportunityResponseDto[]) => {
        this.displayedOpportunities = opportunities; // Display all opportunities as cards
        this.isLoading = false;
        this.errorMessage = null;
      },
      error: (err) => {
        console.error('Error fetching all sales opportunities:', err);
        this.errorMessage = `Failed to load all sales opportunities. Please ensure your Spring Boot backend is running and check console for network errors. Details: ${err.message || 'Unknown error'}`;
        this.isLoading = false;
        this.displayedOpportunities = [];
      }
    });
  }

  /**
   * Resets the form and all display states.
   */
  resetForm(): void {
    this.opportunity = {
      name: '',
      stage: 'Prospecting',
      amount: null,
      closeDate: null,
      leadSource: '',
      notes: null
    };
    if (this.opportunityForm) {
      this.opportunityForm.resetForm();
    }
    this.resetDisplayState();
  }

  /**
   * Helper method to reset the displayed sales opportunity cards and messages.
   */
  private resetDisplayState(): void {
    this.errorMessage = null;
    this.successMessage = null;
    this.opportunityIdInput = null;
    this.displayedOpportunities = []; // Clears all displayed cards
  }
  logout(): void {
    // Implement actual logout logic here (e.g., clearing JWT token from localStorage)
    console.log('Logging out...');
    // For now, just navigate to the login page.
    this.router.navigate(['/login']);
  }
}
