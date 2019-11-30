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

export function parse(cookie: string = ""): { key: string; value: string }[] {
  return cookie
    .split(";")
    .map(it => it.trim())
    .filter(Boolean)
    .map(it => it.split("="))
    .map(([key, value]) => ({ key: key.toLowerCase(), value }));
}

async function get(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { cookies } = req;
    const user = await usersUsecase.findByLoginId(new LoginId(cookies.loginId));
    res
      .writeHead(200, {"content-type": "application/json"})
      .end(JSON.stringify(({ loginId: user.loginId.value })));
  } catch (e) {
    console.error(e);
    res
      .writeHead(500, {"content-type": "application/json"})
      .end((e as Error).stack);
  }
}
