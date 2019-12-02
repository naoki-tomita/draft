import { NextApiRequest, NextApiResponse } from "next";
import { getUsecases } from "../../../api/usecase";
import { LoginId } from "../../../api/domain";

const { usersUsecase } = getUsecases();
export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch ((req.method || "GET").toUpperCase()) {
    case "GET":
      return get(req, res);
    case "POST":
      return post(req, res);
    default:
      res.writeHead(500, { "content-type": "application/json" }).end();
      return;
  }
};

async function get(req: NextApiRequest, res: NextApiResponse) {
  try {
    const users = await usersUsecase.list();
    res
      .writeHead(200, { "content-type": "application/json" })
      .end(JSON.stringify(users.map(it => ({ loginId: it.loginId.value }))));
  } catch (e) {
    console.error(e);
    res
      .writeHead(500, { "content-type": "application/json" })
      .end((e as Error).stack);
  }
}

async function post(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { loginId } = req.body;
    const user = await usersUsecase.create(new LoginId(loginId));
    res
      .writeHead(200, { "content-type": "application/json" })
      .end(JSON.stringify({ loginId: user.loginId.value }));
  } catch (e) {
    console.error(e);
    res
      .writeHead(500, { "content-type": "application/json" })
      .end((e as Error).stack);
  }
}
