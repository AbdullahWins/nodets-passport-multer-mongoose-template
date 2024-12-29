//src/models/admin/admin.model.ts
import { Schema, model } from "mongoose";
import { IAdminDocument, IAdminModel } from "../../../interfaces";
import { ENUM_ADMIN_ROLES } from "../../../utils";

const AdminSchema = new Schema({
  school_uid: {
    type: String,
    required: [true, "School id is required"],
  },
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  image: {
    type: String,
    required: [true, "Image is required"],
    default: "/public/default/default.png",
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  role: {
    type: String,
    enum: ENUM_ADMIN_ROLES,
    default: ENUM_ADMIN_ROLES.STAFF_ADMIN,
  },
  assigned_schools: {
    type: [String],
    required: [true, "Assigned schools are required"],
  },
});

const Admin = model<IAdminDocument, IAdminModel>("Admin", AdminSchema);
export default Admin;
