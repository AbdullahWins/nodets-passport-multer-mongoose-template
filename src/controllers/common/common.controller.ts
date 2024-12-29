// import httpStatus from "http-status";
// import { Request, RequestHandler, Response } from "express";
// import { catchAsync } from "../../middlewares";
// import { signInAdminService, signInEntityService } from "../../services";
// import { sendResponse, staticProps } from "../../utils";

// export const SignInCentralController: RequestHandler = catchAsync(
//   async (req: Request, res: Response) => {
//     return 1;
//       const parsedData = req.body;

//       let result;

//       if (parsedData.school_uid === "000") {
//         result = await signInAdminService(parsedData);
//       } else {
//         result = await signInEntityService(parsedData);
//       }

//       sendResponse(res, {
//         statusCode: httpStatus.OK,
//         message: staticProps.common.LOGGED_IN,
//         data: result,
//       });
//   }
// );
