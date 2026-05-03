import { Component, OnInit } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

declare var bootstrap: any;

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrls: ['./users.css']
})
export class Users implements OnInit {

  usersList: any[] = [];
  userRole: string = ''; 
  searchName: string = '';
  searchRole: string = '';
  
  newUser = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  };
  
  selectedUser: any = { id: '', name: '', email: '', role: '' };
  
  alertMessage: string | null = null;
  alertClass: string = 'alert-info';

  constructor(private userService: UserService) {}

  ngOnInit() {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    this.userRole = localStorage.getItem('role') || '';
  } else {
    this.userRole = '';
  }

  this.loadUsers();
}

searchUsers() {
  this.userService.getUser(this.searchName, this.searchRole).subscribe({
    next: (data) => {
            this.usersList = Array.isArray(data) ? data : [];

      // Sort alphabetically by name
      this.usersList.sort((a, b) => a.name.localeCompare(b.name));

      if (this.usersList.length === 0) {
        this.showAlert('No users found with these filters.', 'alert-warning');
      }
    },
    error: () => {
      this.showAlert('Error searching users.', 'alert-danger');
    }
  });
  
}
resetFilters() {
  this.searchName = '';
  this.searchRole = '';
  this.loadUsers(); 
}


  // Load users
  loadUsers() {
    this.userService.getUser().subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.usersList = data;
        } else if (data && data.users) {
          this.usersList = data.users;
        }
        
      // Sort alphabetically by name
      this.usersList.sort((a, b) => a.name.localeCompare(b.name));
      },
      error: () => {
        this.showAlert('Error loading users.', 'alert-danger');
      }
    });
  }

  // Create user
  saveUser() {
    if (this.userRole !== 'admin') {
    this.showAlert('You do not have permission to create users.', 'alert-danger');
    return;
  }
    if (!this.newUser.name || !this.newUser.email || !this.newUser.password || 
        !this.newUser.confirmPassword || !this.newUser.role) {
      this.showAlert('Please fill all fields before saving.', 'alert-warning');
      return;
    }

    if (this.newUser.password !== this.newUser.confirmPassword) {
      this.showAlert('Passwords do not match.', 'alert-danger');
      return;
    }

    this.userService.createUser(this.newUser).subscribe({
      next: () => {
        this.showAlert('User created successfully!', 'alert-success');
        this.loadUsers();
        this.newUser = { name: '', email: '', password: '', confirmPassword: '', role: '' };
      },
      error: () => {
        this.showAlert('Failed to create user. Please try again.', 'alert-danger');
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

  // Open the modal and load the selected user's data
  openEditModal(user: any) {
  this.selectedUser = { ...user };

  const modalEl = document.getElementById('editUserModal');

  if (modalEl) {
    let modal = bootstrap.Modal.getInstance(modalEl);

    if (modal) {
      modal.hide(); 
    }

    modal = new bootstrap.Modal(modalEl);
    modal.show(); // open modal with updated data
  }
}

// Update user (PUT)
updateUser() {
  if (this.userRole !== 'admin' && this.userRole !== 'editor') {
    this.showAlert('You do not have permission to edit users.', 'alert-danger');
    return;
  }
  if (!this.selectedUser.id) {
    this.showAlert('No user selected for editing.', 'alert-warning');
    return;
  }

  this.userService.updateUser(this.selectedUser.id, this.selectedUser).subscribe({
    next: () => {
      this.showAlert('User updated successfully!', 'alert-success');
      this.loadUsers(); // refresh the updated list
      const modal = document.getElementById('editUserModal');
      if (modal) {
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance?.hide(); // close the modal after updating
      }
    },
    error: () => {
      this.showAlert('Failed to update user.', 'alert-danger');
    }
  });
}
// Delete user
deleteUser(id: number) {
  if (this.userRole !== 'admin') {
    this.showAlert('You do not have permission to delete users.', 'alert-danger');
    return;
  }
  // Prevent the administrator from deleting their own user
  const currentUserId = localStorage.getItem('userId'); 
  if (currentUserId && +currentUserId === id) {
    this.showAlert('You cannot delete your own account.', 'alert-warning');
    return;
  }
  
  if (confirm('Are you sure you want to delete this user?')) {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.showAlert('User deleted successfully!', 'alert-success');
        this.loadUsers(); 
      },
      error: () => {
        this.showAlert('Failed to delete user.', 'alert-danger');
      }
    });
  }
}

}
