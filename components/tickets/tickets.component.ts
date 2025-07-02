import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // FormsModule is still needed for ticketIdInput

import { TicketDto, TicketService, TicketStatus } from '../../services/ticket.service';
// CustomerService and ProductService imports no longer needed as the form is removed
// import { CustomerDto, CustomerService } from '../../services/customer.service';
// import { ProductDto, ProductService } from '../../services/product.service';
import { Router,RouterModule } from '@angular/router';
@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule], // Keep FormsModule for ticketIdInput
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {
  // @ViewChild('ticketForm') ticketForm!: NgForm; // Remove NgForm ViewChild

  // ticket object no longer needed as there's no creation form
  // ticket: TicketDto = {
  //   issue: '',
  //   customerId: null as any,
  //   productId: null as any
  // };

  ticketIdInput: number | null = null; // For fetching specific ticket
  displayedTickets: TicketDto[] = []; // For displaying tickets (specific or all)

  errorMessage: string | null = null;
  successMessage: string | null = null; // Keep for general success messages if needed
  isLoading: boolean = false;

  // No longer need availableCustomers or availableProducts
  // availableCustomers: CustomerDto[] = [];
  // availableProducts: ProductDto[] = [];
  ticketStatuses = Object.values(TicketStatus); // Still useful for displaying status

  constructor(
    private ticketService: TicketService,
    // CustomerService and ProductService no longer needed in constructor
    // private customerService: CustomerService,
    // private productService: ProductService
    private router: Router
  ) { }

  ngOnInit(): void {
    this.resetDisplayState(); // Clear display initially
    // No longer need to populate customer/product dropdowns as form is removed
    // this.populateCustomerAndProductDropdowns();
  }

  // populateCustomerAndProductDropdowns() method removed
  // private populateCustomerAndProductDropdowns(): void { /* ... */ }

  // onSubmit() method removed
  // onSubmit(): void { /* ... */ }

  /**
   * Fetches a specific ticket based on the input ID.
   */
  fetchTicketFromInput(): void {
    this.errorMessage = null;
    this.successMessage = null;
    this.displayedTickets = []; // Clear current display before new fetch

    if (this.ticketIdInput === null || isNaN(this.ticketIdInput)) {
      this.errorMessage = 'Please enter a valid Ticket ID.';
      return;
    }

    this.isLoading = true;
    this.ticketService.getTicketById(this.ticketIdInput).subscribe({
      next: (ticket: TicketDto | null) => {
        if (ticket) {
          this.displayedTickets = [ticket]; // Display single ticket as a card
          this.errorMessage = null;
        } else {
          this.errorMessage = `Ticket with ID ${this.ticketIdInput} not found.`;
          this.displayedTickets = [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching specific ticket:', err);
        this.errorMessage = `Failed to load ticket with ID ${this.ticketIdInput}. Check backend/console. Details: ${err.message || 'Unknown error'}`;
        this.isLoading = false;
        this.displayedTickets = [];
      }
    });
  }

  /**
   * Fetches and displays all tickets.
   */
  showAllTickets(): void {
    this.errorMessage = null;
    this.successMessage = null;
    this.ticketIdInput = null; // Clear specific ID input
    this.displayedTickets = []; // Clear specific display before showing all

    this.isLoading = true;
    this.ticketService.getAllTickets().subscribe({
      next: (tickets: TicketDto[]) => {
        this.displayedTickets = tickets; // Display all tickets as cards
        this.isLoading = false;
        this.errorMessage = null;
      },
      error: (err) => {
        console.error('Error fetching all tickets:', err);
        this.errorMessage = `Failed to load all tickets. Please ensure your Spring Boot backend is running and check console for network errors. Details: ${err.message || 'Unknown error'}`;
        this.isLoading = false;
        this.displayedTickets = [];
      }
    });
  }

  // resetForm() method removed, replaced by resetDisplayState for clearing display
  // resetForm(): void { /* ... */ }

  /**
   * Helper method to reset the displayed ticket cards and messages.
   */
  private resetDisplayState(): void {
    this.errorMessage = null;
    this.successMessage = null;
    this.ticketIdInput = null;
    this.displayedTickets = []; // Clears all displayed cards
  }
  logout(): void {
    // Implement actual logout logic here (e.g., clearing JWT token from localStorage)
    console.log('Logging out...');
    // For now, just navigate to the login page.
    this.router.navigate(['/login']);
  }
}
