// src/dtos/guardian/guardian.dto.ts
import { Types } from "mongoose";
import { IGuardian } from "../../../interfaces";

// Base Guardian DTO
export class GuardianDto implements Partial<IGuardian> {
  _id: Types.ObjectId;
  name: string;
  image: string;
  address: string;

  constructor(guardian: IGuardian) {
    this._id = guardian._id!;
    this.name = guardian.name;
    this.image = guardian.image;
    this.address = guardian.address;
  }
}

// DTO for guardian response after signup/signin
export class GuardianResponseDto extends GuardianDto {
  constructor(guardian: IGuardian) {
    super(guardian);
  }
}
