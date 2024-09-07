import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Firm } from '../models/firm';
import { FirmService } from '../services/firm.service';
import { CommentService } from '../services/comment.service';

@Component({
  selector: 'app-owner-firms',
  templateUrl: './owner-firms.component.html',
  styleUrls: ['./owner-firms.component.css']
})
export class OwnerFirmsComponent implements OnInit {
  constructor(private firmService: FirmService, private commentService: CommentService, private router: Router) { }

  ngOnInit(): void {
    this.firmService.getAllFirms().subscribe(
      firms => {
        this.firms = firms;

        this.firms.forEach(firm => {
          this.commentService.getAverageGrade(firm.id).subscribe(
            grade => firm.averageGrade = grade
          );
        });

        this.filteredFirms = this.firms;
      }
    );
  }

  firms: Firm[] = [];
  filteredFirms: Firm[] = [];

  sortOrder: { [key: string]: string } = { name: "", address: "" };

  sortData(column: string) {
    const order = this.sortOrder[column] === "asc" ? "desc" : "asc";
    this.sortOrder[column] = order;

    this.filteredFirms.sort((a, b) => {
      let valueA;
      let valueB;

      if (column == "name") {
        valueA = a.name;
        valueB = b.name;
      }
      else {
        valueA = a.address;
        valueB = b.address;
      }

      if (valueA < valueB) {
        return order === "asc" ? -1 : 1;
      }
      else if (valueA > valueB) {
        return order == "asc" ? 1 : -1;
      }
      else {
        return 0;
      }
    });
  }

  getSortIcon(column: string): string {
    if (this.sortOrder[column] === "desc") {
      return "bi bi-caret-up-fill";
    }
    else if (this.sortOrder[column] === "asc") {
      return "bi bi-caret-down-fill";
    }
    else {
      return "bi bi-caret-down";
    }
  }

  searchName: string = "";
  searchAddress: string = "";

  searchFirms(): void {
    this.filteredFirms = this.firms.filter(firm =>
      (!this.searchName || firm.name.toLowerCase().includes(this.searchName.toLowerCase())) &&
      (!this.searchAddress || firm.address.toLowerCase().includes(this.searchAddress.toLowerCase()))
    );
  }

  getStars(averageGrade: number): string {
    let stars = "";
    const fullStars = Math.floor(averageGrade);
    const halfStar = averageGrade % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      stars += "<i class='fas fa-star text-warning'></i>";
    }

    if (halfStar) {
      stars += "<i class='fas fa-star-half-alt text-warning'></i>";
    }

    for (let i = 0; i < emptyStars; i++) {
      stars += "<i class='far fa-star text-warning'></i>";
    }

    return stars;
  }

  viewDetails(id: number): void {
    this.router.navigate(["owner-firms-details", id]);
  }

  logout(): void {
    localStorage.removeItem("logged");
    this.router.navigate([""]); 
  }
}
