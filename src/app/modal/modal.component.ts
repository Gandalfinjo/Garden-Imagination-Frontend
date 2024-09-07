import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.css"]
})
export class ModalComponent {
  @Input() modalId: string = "";
  @Input() modalTitle: string = "";

  @Output() saveChanges = new EventEmitter<void>();

  onSave(): void {
    this.saveChanges.emit();
  }
}
