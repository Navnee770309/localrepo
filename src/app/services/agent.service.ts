// src/app/services/agent.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Agent } from '../models/agent.model';
import { ErrorDetails } from '../models/error-details.model';

@Injectable({
  providedIn: 'root' // This service is available application-wide
})
export class AgentService {
  // *** IMPORTANT: API Base URL for your Backend Microservice ***
  // This is set to localhost:8081, which you confirmed is your backend's port.
  private apiBaseUrl = 'http://localhost:8088';

  // The specific endpoint path for agents as defined in your Spring Boot AgentController
  // (e.g., @RequestMapping("/api/agents"))
  private agentsEndpoint = '/api/agents';

  // The full URL for agent-related API calls
  private fullAgentsUrl = `${this.apiBaseUrl}${this.agentsEndpoint}`;

  constructor(private http: HttpClient) { } // HttpClient is injected

  /**
   * Centralized error handling for HTTP requests.
   * Parses the backend's ErrorDetails payload if available.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side network error or a script error
      errorMessage = `Client-side Error: ${error.error.message}`;
    } else {
      // Backend error (server-side error)
      if (error.error && typeof error.error === 'object' && error.error.message) {
        // Assuming backend sends ErrorDetails payload
        const errorDetails: ErrorDetails = error.error;
        errorMessage = `Server Error (${error.status}): ${errorDetails.message} - Details: ${errorDetails.details}`;
      } else {
        // Fallback for non-structured errors
        errorMessage = `Server Error (${error.status}): ${error.message || 'Something went wrong on the server.'}`;
      }
    }
    console.error(errorMessage); // Log the detailed error
    return throwError(() => new Error(errorMessage)); // Propagate a user-friendly error
  }

  /**
   * Creates a new agent by sending a POST request to your backend.
   * @param agent The agent data to be created.
   * @returns An Observable of the created Agent.
   */
  createAgent(agent: Agent): Observable<Agent> {
    return this.http.post<Agent>(this.fullAgentsUrl, agent)
      .pipe(
        catchError(this.handleError) // Catch and handle any HTTP errors
      );
  }

  /**
   * Retrieves a single agent by ID by sending a GET request to your backend.
   * @param id The ID of the agent to retrieve.
   * @returns An Observable of the Agent.
   */
  getAgentById(id: number): Observable<Agent> {
    return this.http.get<Agent>(`${this.fullAgentsUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Retrieves all agents by sending a GET request to your backend.
   * @returns An Observable of an array of Agents.
   */
  getAllAgents(): Observable<Agent[]> {
    return this.http.get<Agent[]>(this.fullAgentsUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Add more methods here for updateAgent, deleteAgent, etc., following the same pattern
}
