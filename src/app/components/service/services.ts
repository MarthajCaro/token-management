import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceService } from '../../services/service.service';

declare var bootstrap: any;

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './services.html',
  styleUrls: ['./services.css']
})
export class Services implements OnInit {
  servicesList: any[] = [];
  userRole: string = ''; 

  newService = {
    name: '',
    description: ''
    
  };

  selectedService: any = { id: '', name: '', description: '' };
  searchText: string = '';


  alertMessage: string | null = null;
  alertClass: string = 'alert-info';

  constructor(private serviceService: ServiceService) {}

  ngOnInit() {
    this.userRole = localStorage.getItem('role') || '';
    this.loadServices();
  }

  // Load all services
  loadServices() {
  this.serviceService.getServices().subscribe({
    next: (data) => {
      if (Array.isArray(data)) {
        this.servicesList = data;
      } else if (data && data.services) {
        this.servicesList = data.services;
      }

      // Sort alphabetically by name
      this.servicesList.sort((a, b) => a.name.localeCompare(b.name));
    },
    error: () => {
      this.showAlert('Error loading services.', 'alert-danger');
    }
  });
}
  //  Create new service
  saveService() {
    if (!this.newService.name || !this.newService.description) {
      this.showAlert('Please fill all fields before saving', 'alert-warning');
      return;
    }

    this.serviceService.createService(this.newService).subscribe({
            next: () => {
        this.showAlert('Service created successfully!', 'alert-success');
        this.loadServices();
        this.newService = { name: '', description: '' };
      },
      error: (err) => {
        console.error('Error creating service:', err);
        this.showAlert('Failed to create service.', 'alert-danger');
      }
    });
  }

  //  Open edit modal
  openEditModal(service: any) {
    this.selectedService = { ...service };
  }

  // Update existing service
  updateService() {
    if (!this.selectedService || !this.selectedService.id) {
      this.showAlert('No service selected for editing.', 'alert-warning');
      return;
    }

    this.serviceService.updateService(this.selectedService.id, this.selectedService).subscribe({
      next: () => {
        this.showAlert('Service updated successfully!', 'alert-success');
        this.loadServices();
        const modalEl = document.getElementById('editServiceModal');
        if (modalEl) {
          const modalInstance = bootstrap.Modal.getInstance(modalEl);
          modalInstance?.hide();
        }
      },
      error: (err) => {
        console.error('Error updating service:', err);
        this.showAlert('Failed to update service.', 'alert-danger');
      }
    });
  }

    // Search services by name or description
searchServices() {
  const term = this.searchText.trim().toLowerCase();

  // If no text is entered, reload everything
  if (!term) {
    this.showAlert('Please enter a search term.', 'alert-warning');
    return;
  }

  // Filter services by name or description
  const filtered = this.servicesList.filter(service =>
    (service.name && service.name.toLowerCase().includes(term)) ||
    (service.description && service.description.toLowerCase().includes(term))
  );

  // Sort results alphabetically
  filtered.sort((a, b) => a.name.localeCompare(b.name));

  // Display alert if there are no results
  if (filtered.length === 0) {
    this.showAlert('No services found with that search term.', 'alert-warning');
  } else {
    this.alertMessage = null;
  }

  // Replace the current list with the filtered results
  this.servicesList = filtered;
}
// Reset filters and reload data
resetFilters() {
  this.searchText = '';
  this.alertMessage = null;
  this.loadServices();
}

  // Delete service
  deleteService(id: number | string) {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this service?')) return;

    this.serviceService.deleteService(+id).subscribe({
      next: () => {
        this.showAlert('Service deleted successfully!', 'alert-success');
        this.loadServices();
      },
      error: (err) => {
        console.error('Error deleting service:', err);
        this.showAlert('Failed to delete service.', 'alert-danger');
      }
    });
  }

  // Show alerts
  showAlert(message: string, cssClass: string) {
    this.alertMessage = message;
    this.alertClass = cssClass;

    setTimeout(() => {
      this.alertMessage = null;
    }, 3000);
  }
}


