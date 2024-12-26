// src/interfaces/guardian/guardian.interface.ts
import { Model } from "mongoose";
import { ICommonSchema } from "../../common/common.interface";

// guardian interface
export interface IGuardian extends ICommonSchema {
  name: string;
  image: string;
  address: string;
}

// guardian add interface
export interface IGuardianAdd {
  name: string;
  image: string;
  address: string;
}

// guardian update interface
export interface IGuardianUpdate {
  name?: string;
  image?: string;
  address?: string;
}

// guardian schema methods
export interface IGuardianModel extends Model<IGuardian> {
  isGuardianExistsById(
    guardianId?: string,
    name?: string,
    select?: string
  ): Promise<IGuardian | null>;
}

export interface IGuardianDocument extends IGuardian, Document {}
