import { Service } from "./service";

export interface Appointment {
    id: number;
    user: string;
    firmId: number;
    datetime: string;
    squareMeters: number;
    type: string;
    poolSquareMeters: number;
    greenSquareMeters: number;
    chillSquareMeters: number;
    fountainSquareMeters: number;
    tables: number;
    chairs: number;
    shortDescription: string;
    services: Service[];
    status: string;
    decorator: string;
    rejectionComment: string;
    photo: string;
    finishedDateTime: string;
    maintenanceStart: string;
    maintenanceEnd: string;
    createdAt: string;
    layout: string;
}