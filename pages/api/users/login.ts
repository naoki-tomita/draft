import { NextApiRequest, NextApiResponse } from "next";
import { getUsecases } from "../../../api/usecase";
import { LoginId } from "../../../api/domain";

const { usersUsecase } = getUsecases();
export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch ((req.method || "GET").toUpperCase()) {
    case "POST":
      return post(req, res);
    default:
      res.writeHead(500, {"content-type": "application/json"}).end();
      return;
  }
}

async function post(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { body: { loginId } } = req;
    const user = await usersUsecase.findByLoginId(new LoginId(loginId));
    res
      .writeHead(200, {
        "content-type": "application/json",
        "set-cookie": `loginId=${user.loginId.value}; path=/;`
      }).end();
  } catch (e) {
    console.error(e);
    res
      .writeHead(500, {"content-type": "application/json"})
      .end((e as Error).stack);
  }
}
