import { NextPage } from "next";
import Router from "next/router";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Breadcrumbs,
  Link
} from "@material-ui/core";
import {
  fetchCandidate,
  origin,
  execIdentify,
  postCandidates
} from "../../api/Client";
import { Candidate } from "../../Components/Candidates/Candidate";
import { FC, useRef, useEffect, useState } from "react";
import { Chart } from "chart.js";

interface State {
  recommend: string;
  failedToPost: boolean;
}

const VoteComponent: FC<Props> = ({ candidate }) => {
  const [state, setState] = useState<State>({
    recommend: "",
    failedToPost: false
  });
  const { recommend, failedToPost } = state;

  async function create(good: boolean) {
    const result = await postCandidates(candidate.id, recommend, good);
    if (result.ok) {
      Router.reload();
      return setState({ recommend: "", failedToPost: false });
    }
    setState({ ...state, failedToPost: true });
  }

  return (
    <>
      <Typography component="span" variant="h3">
        {candidate.id}
      </Typography>
      <Typography component="span" variant="h5">
        さん
      </Typography>
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
        <div style={{ marginTop: "8px", width: 250 }}>
          <TextField
            onChange={e => setState({ ...state, recommend: e.target.value })}
            id="outlined-basic"
            label="Comment"
            variant="outlined"
            multiline
            fullWidth
          />
        </div>
        <div style={{ marginTop: "8px" }}>
          <Button onClick={() => create(true)}>👍</Button>
          <Button style={{ marginLeft: "8px" }} onClick={() => create(false)}>
            👎
          </Button>
        </div>
      </div>
    </>
  );
};

const VoteResultComponent: FC<Props> = ({ candidate }) => {
  const ref = useRef<HTMLCanvasElement>();
  useEffect(() => {
    const data = candidate.recommends.reduce(
      ([good, bad], curr) => [
        curr.good ? good + 1 : good,
        curr.good ? bad : bad + 1
      ],
      [0, 0]
    );
    new Chart(ref.current.getContext("2d"), {
      type: "pie",
      data: {
        labels: ["👍よい", "👎よくない"],
        datasets: [
          {
            data,
            backgroundColor: ["#2196f3", "#f44336"]
          }
        ]
      }
    });
  }, []);
  return (
    <>
      <Typography component="span" variant="h3">
        {candidate.id}
      </Typography>
      <Typography component="span" variant="h5">
        さん
      </Typography>
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1 }}>
          <List>
            {candidate.recommends.map((it, i) => (
              <ListItem key={i} alignItems="flex-start">
                <ListItemText
                  primary={it.loginId}
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="textPrimary"
                      >
                        {it.good ? "👍" : "👎"}
                        {it.recommend}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </div>
        <div style={{ flex: 2 }}>
          <canvas ref={ref} />
        </div>
      </div>
    </>
  );
};

interface Props {
  candidate: Candidate | null;
}

const CandidatePage: NextPage<Props> = ({ candidate }) => {
  return (
    <>
      <div style={{ marginTop: 16, marginBottom: 16 }}>
        <Breadcrumbs>
          <Link color="inherit" href="/">
            お薦めする
          </Link>
          <Link color="inherit" href="/candidates">
            一覧をみる
          </Link>
          <Typography color="textPrimary">{candidate.id}</Typography>
        </Breadcrumbs>
      </div>
      {candidate.done ? (
        <VoteResultComponent candidate={candidate} />
      ) : (
        <VoteComponent candidate={candidate} />
      )}
    </>
  );
};

CandidatePage.getInitialProps = async ctx => {
  const { req, query } = ctx;
  const [user, candidate] = await Promise.all([
    execIdentify(origin(), req.headers.cookie),
    fetchCandidate(origin(), parseInt(query.id as string, 10))
  ]);
  return {
    candidate: {
      ...candidate,
      done: candidate.recommends.some(it => it.loginId === user.loginId)
    }
  };
};

export default CandidatePage;
