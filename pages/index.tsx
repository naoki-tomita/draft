import { NextPage } from "next";
import Router from "next/router";
import { TextField, Button, Typography, Breadcrumbs } from "@material-ui/core";
import { useState } from "react";
import { postCandidates, fetchCandidates, execIdentify } from "../api/Client";
import { Candidate } from "../Components/Candidates/Candidate";
import { CandidatesComponents } from "../Components/Candidates";

interface State {
  id: string;
  recommend: string;
  failedToPost: boolean;
}

const IndexPage: NextPage = () => {
  const [state, setState] = useState<State>({
    id: "",
    recommend: "",
    failedToPost: false
  });
  const { id, recommend, failedToPost } = state;

  async function create() {
    const result = await postCandidates(parseInt(id, 10), recommend, true);
    if (result.ok) {
      return setState({ id: "", recommend: "", failedToPost: false });
    }
    setState({ ...state, failedToPost: true });
  }

  return (
    <>
      <div style={{ marginTop: 16 }}>
        <Breadcrumbs>
          <Typography color="textPrimary">お薦めする</Typography>
        </Breadcrumbs>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column"
        }}
      >
        <div style={{ marginTop: "12px" }}>
          {failedToPost && (
            <Typography color="error">failed to post.</Typography>
          )}
        </div>
        <div style={{ marginTop: "12px", width: 250 }}>
          <TextField
            onChange={e => setState({ ...state, id: e.target.value })}
            id="outlined-basic"
            label="おすすめする人のID"
            variant="outlined"
            value={id}
            fullWidth
          />
        </div>
        <div style={{ marginTop: "12px", width: 250 }}>
          <TextField
            onChange={e => setState({ ...state, recommend: e.target.value })}
            id="outlined-basic"
            label="おすすめする理由"
            variant="outlined"
            value={recommend}
            multiline
            fullWidth
          />
        </div>
        <div style={{ marginTop: "12px" }}>
          <Button onClick={() => create()}>Create</Button>
        </div>
      </div>
    </>
  );
};

export default IndexPage;
