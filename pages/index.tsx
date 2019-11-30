import { NextPage } from "next";
import { Box, TextField, Button } from "@material-ui/core";
import { useState } from "react";
import fetch from "node-fetch";
import { postCandidates } from "../api/Client";

interface State {
  id: string;
  recommend: string;
}

const IndexPage: NextPage = () => {
  const [state, setState] = useState<State>({ id: "", recommend: "" });
  const { id, recommend } = state;

  async function create() {
    await postCandidates(parseInt(id, 10), recommend);
    setState({ id: "", recommend: "" });
  }

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <div style={{ marginTop: "12px", width: 250 }}>
        <TextField
          onChange={e => setState({ ...state, id: e.target.value })}
          id="outlined-basic"
          label="おすすめする人のID"
          variant="outlined"
          value={id}
          fullWidth />
      </div>
      <div style={{ marginTop: "12px", width: 250 }}>
        <TextField
          onChange={e => setState({ ...state, recommend: e.target.value })}
          id="outlined-basic"
          label="おすすめする理由"
          variant="outlined"
          value={recommend}
          multiline
          fullWidth />
      </div>
      <div style={{ marginTop: "12px" }}>
        <Button onClick={() => create()} >Create</Button>
      </div>
    </div>
  );
}

export default IndexPage;
