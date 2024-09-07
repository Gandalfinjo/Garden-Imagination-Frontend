import { Service } from "./service";
import { User } from "./user";

export class Firm {
    id: number = 0;
    name: string = "";
    address: string = "";
    services: Service[] = [];
    decorators: User[] = [];
    contact: string = "";
    workingHoursStart: string = "";
    workingHoursEnd: string = "";
    holidayStart: string = "";
    holidayEnd: string = "";
    averageGrade: number = 0;
}