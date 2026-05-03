import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class Sidebar implements OnInit {
  userRole: string = 'Invited ';

  constructor(private router: Router) {}

  ngOnInit() {
    // Avoid error if localStorage does not exist
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const role = localStorage.getItem('role');
      this.userRole = role ? role : 'Invited ';
      console.log('Actual function:', this.userRole);
    }
  }

  logout() {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    localStorage.clear();
  }

  // Navigate to login 
  this.router.navigateByUrl('/').then(() => {
    window.location.reload();
  });
}

}
