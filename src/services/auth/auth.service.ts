import { IAdminCreate, IAdminSignin, IUploadFile } from "../../interfaces";

export const signUpEntityService = async (
  adminData: IAdminCreate,
  file: IUploadFile[] | undefined
) => {
  //check students then teachers then school admins to find the user
};

export const signInEntityService = async (adminData: IAdminSignin) => {
  //check students then teachers then school admins to find the user
};
