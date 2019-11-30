import { NextPage } from "next";
import { TextField, Button, Box, Typography } from "@material-ui/core";
import { useState } from "react";
import fetch from "node-fetch";
import { execLogin, execCreate } from "../../api/Client";

interface State {
  loginId: string;
  failedToLogin: boolean;
  logining: boolean;
  alreadyExist: boolean;
}

const LoginPage: NextPage = () => {
  const [state, setState] = useState<State>({ loginId: "", failedToLogin: false, logining: false, alreadyExist: false });
  const { loginId, failedToLogin, logining, alreadyExist } = state;

  async function login() {
    setState({ ...state, logining: true, failedToLogin: false });
    const result = await execLogin(loginId);
    if (!result.ok) {
      setState({ ...state, failedToLogin: true, logining: false });
      return;
    }
    return location.href = "/";
  }

  async function create() {
    setState({ ...state, logining: true, failedToLogin: false });
    const result = await execCreate(loginId);
    if (!result.ok) {
      setState({ ...state, alreadyExist: true });
      return;
    }
    await execLogin(loginId);
    return location.href = "/";
  }

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      {failedToLogin && <div><Typography color="error">Failed to Login.</Typography></div>}
      {alreadyExist && <div><Typography color="error">User already exist.</Typography></div>}
      <Box marginBottom="8px"/>
      <TextField
        onChange={e => setState({ ...state, loginId: e.target.value })}
        onKeyPress={e => e.key === "Enter" && login()}
        id="outlined-basic" label="Outlined" variant="outlined" />
      <Box marginBottom="8px"/>
      <div>
      <Button disabled={logining} onClick={() => login()}>Login</Button>
      <Button style={{ marginLeft: "8px" }} onClick={() => create()}>Create</Button>
      </div>
    </div>
  );
}

export default LoginPage;
