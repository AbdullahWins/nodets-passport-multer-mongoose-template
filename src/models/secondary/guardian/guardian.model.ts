//src/models/guardian/guardian.model.ts
import moment from "moment";
import { Schema, model } from "mongoose";
import { IGuardian, IGuardianDocument, IGuardianModel } from "../../../interfaces";

const GuardianSchema = new Schema<IGuardianDocument>({
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

// checking is guardian found with the id
GuardianSchema.statics.isGuardianExistsById = async function (
  guardianId: string,
  select: string
): Promise<IGuardian | null> {
  const guardian = await this.findById(guardianId).select(select).lean();
  return guardian;
};

// checking is guardian found with the email
GuardianSchema.statics.isGuardianExistsByName = async function (
  name: string,
  select: string
): Promise<IGuardian | null> {
  const guardian = await this.findOne({ name }).select(select).lean();
  return guardian;
};

const Guardian = model<IGuardianDocument, IGuardianModel>("Guardian", GuardianSchema);
export default Guardian;
