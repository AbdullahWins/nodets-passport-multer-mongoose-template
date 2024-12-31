// src/interfaces/metadata/metadata.interface.ts
import { Model } from "mongoose";
import { ICommonSchema } from "../../common/common/common.interface";

// metadata interface
export interface IMetadata extends ICommonSchema {
  school_uid: string;
  school_name: string;
  school_db_name: string;
}

// metadata add interface
export interface IMetadataCreate {
  school_uid: string;
  school_name: string;
  school_db_name: string;
}

// metadata update interface
export interface IMetadataUpdate {
  school_uid: string;
  school_name?: string;
  school_db_name?: string;
}

// metadata schema methods
export interface IMetadataModel extends Model<IMetadata> {}

export interface IMetadataDocument extends IMetadata, Document {}
