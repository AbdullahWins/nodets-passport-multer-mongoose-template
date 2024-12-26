// src/dtos/student/student.dto.ts
import { Types } from "mongoose";
import { IStudent } from "../../../interfaces";

// Base Student DTO
export class StudentDto implements Partial<IStudent> {
  _id: Types.ObjectId;
  name: string;
  image: string;
  address: string;

  constructor(student: IStudent) {
    this._id = student._id!;
    this.name = student.name;
    this.image = student.image;
    this.address = student.address;
  }
}

// DTO for student response after signup/signin
export class StudentResponseDto extends StudentDto {
  constructor(student: IStudent) {
    super(student);
  }
}
