import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgentService } from './services/agent.service';
import { Agent } from './models/agent.model';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})

export class AppComponent implements OnInit {
  agentForm: FormGroup;
  addAgentMessage: string = '';
  addAgentSuccess: boolean = false;

  selectedDisplayOption: 'all' | 'specific' = 'all';
  specificAgentId: number | null = null;
  specificAgentMessage: string = '';
  agents$: Observable<Agent[]> | undefined;

  constructor(private fb: FormBuilder, private agentService: AgentService) {
    this.agentForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.getAllAgents();
  }

  onDisplayOptionChange(): void {
    this.specificAgentMessage = '';
    this.agents$ = of([]);
    if (this.selectedDisplayOption === 'all') {
      this.getAllAgents();
    }
  }

  getAllAgents(): void {
    this.agents$ = this.agentService.getAllAgents().pipe(
      catchError(error => {
        console.error('Failed to load all agents:', error);
        this.specificAgentMessage = `Error fetching all agents: ${error.message}`;
        return of([]);
      })
    );
  }

  getSpecificAgent(): void {
    this.specificAgentMessage = '';
    this.agents$ = of([]);

    if (this.specificAgentId === null || isNaN(this.specificAgentId)) {
      this.specificAgentMessage = 'Please enter a valid numeric Agent ID.';
      return;
    }

    this.agentService.getAgentById(this.specificAgentId).pipe(
      catchError(error => {
        console.error(`Failed to load agent with ID ${this.specificAgentId}:`, error);
        this.specificAgentMessage = `Error: ${error.message}`;
        return of(undefined);
      })
    ).subscribe(agent => {
      if (agent) {
        this.agents$ = of([agent]);
      } else {
        this.specificAgentMessage = `Agent with ID ${this.specificAgentId} not found.`;
        this.agents$ = of([]);
      }
    });
  }

  addAgent(): void {
    if (this.agentForm.valid) {
      const newAgent: Agent = this.agentForm.value;
      this.agentService.createAgent(newAgent).subscribe({
        next: (agent) => {
          this.addAgentMessage = `Agent "${agent.name}" added successfully! ID: ${agent.id}`;
          this.addAgentSuccess = true;
          this.agentForm.reset();
          this.agentForm.markAsPristine();
          this.agentForm.markAsUntouched();
          this.getAllAgents();
        },
        error: (err) => {
          this.addAgentMessage = `Error adding agent: ${err.message}`;
          this.addAgentSuccess = false;
        }
      });
    } else {
      this.addAgentMessage = 'Please fill out the form correctly to add an agent.';
      this.addAgentSuccess = false;
      this.agentForm.markAllAsTouched();
    }
  }
}
