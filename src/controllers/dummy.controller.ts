import { Request, Response, RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import CustomError from "../utils/handlers/error.handler";
import CustomResponse from "../utils/handlers/response.handler";

export const dummyController: RequestHandler = asyncHandler(
	async (req: Request, res: Response): Promise<any> => {
		try {
			const Test: any = {};

			// throw new CustomError("Testing Custom Error", 400);

			return new CustomResponse(res).success(
				"Dummy data",
				{ Test },
				200,
				{
					type: "test",
				}
			);
		} catch (e: any) {
			return new CustomResponse(res, e).error(e.message, e.status, {});
		}
	}
);
