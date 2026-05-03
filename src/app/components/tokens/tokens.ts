import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../services/token.service';
import { UserService } from '../../services/user.service';
import { ServiceService } from '../../services/service.service';
import { FormsModule } from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'app-tokens',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tokens.html',
  styleUrls: ['./tokens.css']
})
export class Tokens implements OnInit {
  tokenList: any[] = [];
  usersList: any[] = [];
  servicesList: any[] = [];
  userRole: string = '';
  filteredTokens: any[] = [];

  searchService: string = '';
  startDate: string = '';
  endDate: string = '';

  newToken = {
    value: '',
    creation_date: '',
    expiration_date: '',
    user_id: '',
    service_id: ''
  };

  selectedToken: any = { id: '', value: '', creation_date: '', expiration_date: '', user_id: '', service_id: '' };

  showAlertMessage = false;
  alertMessage: string | null = null;
  alertClass: string = 'alert-info';

  constructor(
    private tokenService: TokenService,
    private usersService: UserService,
    private serviceService: ServiceService
  ) {}

  ngOnInit() {  
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    this.userRole = localStorage.getItem('role') || '';
  } else {
    this.userRole = '';
  }

  this.loadTokens();
  this.loadUsers();
  this.loadServices();
}


  loadTokens() {
  this.tokenService.getToken().subscribe({
    next: (data) => {
      if (Array.isArray(data)) {
        this.tokenList = data;
      } else if (data && data.tokens) {
        this.tokenList = data.tokens;
      }

      // Sort by creation date
      this.tokenList.sort(
        (a, b) =>
          new Date(b.creation_date).getTime() - new Date(a.creation_date).getTime()
      );
    },
    error: () => {
      this.showAlert('Error loading tokens.', 'alert-danger');
    }
  });
}
  loadUsers() {
    this.usersService.getUser().subscribe({
      next: (data) => this.usersList = data,
      error: (err) => console.error('Error loading users:', err)
    });
  }
  

  loadServices() {
    this.serviceService.getServices().subscribe({
      next: (data) => {
        if (Array.isArray(data)) this.servicesList = data;
        else if (Array.isArray(data.services)) this.servicesList = data.services;
        else if (Array.isArray(data.results)) this.servicesList = data.results;
        else this.servicesList = [];
      },
      error: (err) => console.error('Error loading services:', err)
    });
  }
  
// Search tokens by filters
searchTokens() {
  this.alertMessage = null; 
  this.filteredTokens = this.tokenList.filter(token => {
    const serviceName = this.getServiceName(token.service_id).toLowerCase();
    const creationDate = new Date(token.creation_date);
    const start = this.startDate ? new Date(this.startDate) : null;
    const end = this.endDate ? new Date(this.endDate) : null;

    const matchesService =
      !this.searchService || serviceName.includes(this.searchService.toLowerCase());
    const matchesDateRange =
      (!start || creationDate >= start) && (!end || creationDate <= end);

    return matchesService && matchesDateRange;
  });

  // Sort by date descending
  this.filteredTokens.sort(
    (a, b) => new Date(b.creation_date).getTime() - new Date(a.creation_date).getTime()
  );

  if (this.filteredTokens.length === 0) {
    this.showAlert('No tokens found with these filters.', 'alert-warning');
  }

  this.tokenList = [...this.filteredTokens];
}
//  Reset filters
resetFilters() {
  this.searchService = '';
  this.startDate = '';
  this.endDate = '';
  this.alertMessage = null;
  this.loadTokens();
}

     // Create token (admin only)
  saveToken() {
    if (this.userRole !== 'admin') {
      this.showAlert('You do not have permission to create tokens.', 'alert-warning');
      return;
    }

    this.tokenService.createToken(this.newToken).subscribe({
      next: () => {
        this.showAlert('Token created successfully!', 'alert-success');
        this.loadTokens();
        this.newToken = { value: '', creation_date: '', expiration_date: '', user_id: '', service_id: '' };

        const modalEl = document.getElementById('createTokenModal');
        if (modalEl) {
          const modalInstance = bootstrap.Modal.getInstance(modalEl);
          modalInstance?.hide();
        }
      },
      error: (err) => {
        console.error('Error creating token:', err);
        this.showAlert('Failed to create token.', 'alert-danger');
      }
    });
  }

  // Open edit modal
  openEditModal(token: any) {
    this.selectedToken = { ...token };
  }

  // Refresh token (admin or editor)
  updateToken() {
    if (this.userRole !== 'admin' && this.userRole !== 'editor') {
      this.showAlert('No token selected for editing.', 'alert-warning');
      return;
    }

    if (!this.selectedToken || !this.selectedToken.id) {
      this.showAlert('No token selected for editing', 'alert-warning');
      return;
    }

    this.tokenService.updateToken(this.selectedToken.id, this.selectedToken).subscribe({
      next: () => {
        this.showAlert('Token updated successfully!', 'alert-success');
        this.loadTokens();
        const modal = document.getElementById('editTokenModal');
        if (modal) {
          const modalInstance = bootstrap.Modal.getInstance(modal);
          modalInstance?.hide();
        }
      },
      error: (err) => {
        console.error('Error updating token:', err);
        this.showAlert('Failed to update token', 'alert-danger');
      }
    });
  }

  // Delete token
  deleteToken(id: number | string) {
    if (this.userRole !== 'admin') {
      this.showAlert('You do not have permission to delete tokens.', 'alert-danger');
      return;
    }

    if (!id) return;
    if (!confirm('¿Are you sure you want to delete this token?')) return;

    this.tokenService.deleteToken(+id).subscribe({
      next: () => {
        this.showAlert('Token deleted successfully!', 'alert-success');
        this.loadTokens();
      },
      error: (err) => {
        console.error('Error deleting token:', err);
        this.showAlert('Failed to delete token.', 'alert-danger');
      }
    });
  }

  // Show alerts
  showAlert(message: string, type: string = 'alert-info') {
    this.alertMessage = message;
    this.alertClass = type;
    this.showAlertMessage = true;
    setTimeout(() => {
      this.showAlertMessage = false;
    }, 3000);
  }

  getUserName(userId: number | string): string {
    const user = this.usersList.find(u => u.id === userId);
    return user ? user.name : 'N/A';
  }

  getServiceName(serviceId: number | string): string {
    const service = this.servicesList.find(s => s.id === serviceId);
    return service ? service.name : 'N/A';
  }
}
