// src/interfaces/qrcode/qrcode.interface.ts

import { Types } from "mongoose";
// import { ENUM_GAME_TYPES } from "../../utils";


// QR Code options
export interface IQRCodeOptions {
  width: number; // QR code size
  margin: number; // Padding around the QR code
  color: {
    dark: string; // Dark color (foreground)
    light: string; // Light color (background)
  };
}

// Define the type for QR code input
export type IQRCode = Types.ObjectId; // Data to encode in the QR code
