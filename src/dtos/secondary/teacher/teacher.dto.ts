// src/dtos/teacher/teacher.dto.ts
import { Types } from "mongoose";
import { ITeacher } from "../../../interfaces";

// Base Teacher DTO
export class TeacherDto implements Partial<ITeacher> {
  _id: Types.ObjectId;
  name: string;
  image: string;
  address: string;

  constructor(teacher: ITeacher) {
    this._id = teacher._id!;
    this.name = teacher.name;
    this.image = teacher.image;
    this.address = teacher.address;
  }
}

// DTO for teacher response after signup/signin
export class TeacherResponseDto extends TeacherDto {
  constructor(teacher: ITeacher) {
    super(teacher);
  }
}
