//src/models/school/school.model.ts
import moment from "moment";
import { Schema, model } from "mongoose";
import { ISchool, ISchoolDocument, ISchoolModel } from "../../../interfaces";

const SchoolSchema = new Schema<ISchoolDocument>({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  image: {
    type: String,
    required: [true, "Image is required."],
  },
  address: {
    type: String,
    required: [true, "Address is required"],
  },
  createdAt: {
    type: Number,
    default: () => moment().utc().unix(),
  },
  updatedAt: {
    type: Number,
    default: () => moment().utc().unix(),
  },
});

// checking is school found with the id
SchoolSchema.statics.isSchoolExistsById = async function (
  schoolId: string,
  select: string
): Promise<ISchool | null> {
  const school = await this.findById(schoolId).select(select).lean();
  return school;
};

// checking is school found with the email
SchoolSchema.statics.isSchoolExistsByName = async function (
  name: string,
  select: string
): Promise<ISchool | null> {
  const school = await this.findOne({ name }).select(select).lean();
  return school;
};

const School = model<ISchoolDocument, ISchoolModel>("School", SchoolSchema);
export default School;
