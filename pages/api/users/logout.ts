import { NextApiRequest, NextApiResponse } from "next";
import { getUsecases } from "../../../api/usecase";
import { LoginId } from "../../../api/domain";

const { usersUsecase } = getUsecases();
export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch ((req.method || "GET").toUpperCase()) {
    case "GET":
      return get(req, res);
    default:
      res.writeHead(500, {"content-type": "application/json"}).end();
      return;
  }
}

async function get(req: NextApiRequest, res: NextApiResponse) {
  res
    .writeHead(200, {
      "content-type": "application/json",
      "set-cookie": `loginId=; path=/;`
    }).end();
}
