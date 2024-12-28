// src/dtos/student/student.dto.ts
import { Types } from "mongoose";
import { IStudent } from "../../../interfaces";

// Base Student DTO
export class StudentDto implements Partial<IStudent> {
  _id: Types.ObjectId;
  school_uid: string;
  student_name: string;
  student_email: string;
  student_image: string;
  student_address: string;

  constructor(student: IStudent) {
    this._id = student._id!;
    this.school_uid = student.school_uid;
    this.student_name = student.student_name;
    this.student_email = student.student_email;
    this.student_image = student.student_image;
    this.student_address = student.student_address;
  }
}

// DTO for student response after signup/signin
export class StudentResponseDto extends StudentDto {
  constructor(student: IStudent) {
    super(student);
  }
}
