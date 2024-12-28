// src/services/student/student.service.ts
import httpStatus from "http-status";
import { paginate } from "../../../utils";
import { ApiError } from "../../../cores";
import { getSchoolModel } from "../../../cores";
import { StudentResponseDto } from "../../../dtos";
import { IStudent, IStudentUpdate } from "../../../interfaces";
import { STUDENT_MODEL_NAME, StudentSchema } from "../../../models";

// Get all students with pagination
export const getAllStudentsService = async (
  school_uid: string,
  page: number,
  limit: number
) => {
  const StudentModel = await getSchoolModel<IStudent>(
    school_uid,
    STUDENT_MODEL_NAME,
    StudentSchema
  );

  const paginatedResult = await paginate(StudentModel.find(), { page, limit });

  const studentsFromDto = paginatedResult.data.map(
    (student) => new StudentResponseDto(student.toObject())
  );

  return { studentsFromDto, meta: paginatedResult.meta };
};

// Get a student by ID
export const getStudentByIdService = async (
  school_uid: string,
  studentId: string
) => {
  const StudentModel = await getSchoolModel<IStudent>(
    school_uid,
    STUDENT_MODEL_NAME,
    StudentSchema
  );

  const student = await StudentModel.findById(studentId);
  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, "Student not found.");
  }

  return new StudentResponseDto(student);
};

// Update a student by ID
export const updateStudentByIdService = async (
  studentId: string,
  updateData: IStudentUpdate
) => {
  const StudentModel = await getSchoolModel<IStudent>(
    updateData.school_uid,
    STUDENT_MODEL_NAME,
    StudentSchema
  );

  const student = await StudentModel.findById(studentId);
  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, "Student not found.");
  }

  const updatedStudent = await StudentModel.findOneAndUpdate(
    { _id: studentId },
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!updatedStudent) {
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to update student.");
  }

  return new StudentResponseDto(updatedStudent);
};

// Delete a student by ID
export const deleteStudentByIdService = async (
  school_uid: string,
  studentId: string
) => {
  const StudentModel = await getSchoolModel<IStudent>(
    school_uid,
    STUDENT_MODEL_NAME,
    StudentSchema
  );

  const result = await StudentModel.deleteOne({ _id: studentId });

  if (result.deletedCount === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "Student not found.");
  }

  return result;
};
