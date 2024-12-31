// src/dtos/admin/admin.dto.ts
import { Types } from "mongoose";
import { IAdmin } from "../../../interfaces";
import { getFileUrl } from "../../../utils";

// Base Admin DTO with minimal properties
class AdminDtoBase implements Partial<IAdmin> {
  _id: Types.ObjectId;
  name: string;
  email: string;
  // password: string;
  image: string;
  assigned_schools: string[];

  constructor(
    admin: Pick<
      IAdmin,
      "_id" | "name" | "email" | "image" | "password" | "assigned_schools"
    >
  ) {
    this._id = admin._id!;
    this.name = admin.name;
    this.email = admin.email;
    // this.password = admin.password;
    this.image = getFileUrl(admin.image);
    this.assigned_schools = admin.assigned_schools;
  }
}

// Extended Admin DTO with additional properties
export class AdminResponseDto extends AdminDtoBase {
  constructor(admin: IAdmin) {
    super(admin);
  }
}
