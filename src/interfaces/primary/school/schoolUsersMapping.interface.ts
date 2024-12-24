// src/interfaces/schoolUsersMapping/schoolUsersMapping.interface.ts
import { Model } from "mongoose";
import { ICommonSchema } from "../../common/common.interface";

// schoolUsersMapping interface
export interface ISchoolUsersMapping extends ICommonSchema {
  email: string;
  school_name: string;
  school_image: string;
  school_id: string;
  db_name: string;
}

// schoolUsersMapping add interface
export interface ISchoolUsersMappingAdd {
  email: string;
  school_name: string;
  school_image: string;
  school_id: string;
  db_name: string;
}

// schoolUsersMapping update interface
export interface ISchoolUsersMappingUpdate {
  email?: string;
  school_name?: string;
  school_image?: string;
  school_id?: string;
  db_name?: string;
}

// schoolUsersMapping schema methods
export interface ISchoolUsersMappingModel extends Model<ISchoolUsersMapping> {
  isSchoolUsersMappingExistsById(
    school_id: string,
    select?: string
  ): Promise<ISchoolUsersMapping | null>;
}

export interface ISchoolUsersMappingDocument
  extends ISchoolUsersMapping,
    Document {}
