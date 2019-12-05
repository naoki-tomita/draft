import App, { AppContext } from "next/app";
import Link from "next/link";
import Router from "next/router";
import "./_app.css";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Breadcrumbs
} from "@material-ui/core";
import { Menu, People } from "@material-ui/icons";
import { execIdentify, execLogout, origin } from "../api/Client";
import Head from "next/head";

interface Props {
  user: { loginId: string };
}

function identify(cookies: string) {
  return execIdentify(cookies);
}

async function logout() {
  await execLogout();
  location.href = "/login";
}

interface State {
  isOpen: boolean;
}

export default class MyApp extends App<Props, {}, State> {
  constructor(...args: any[]) {
    super(args[0], args[1]);
    this.state = { isOpen: false };
  }

  componentDidMount() {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }

  static async getInitialProps({ Component, ctx }: AppContext) {
    const { req, res } = ctx;
    const user = await identify(req?.headers?.cookie);

    if (
      !user &&
      !(process.browser
        ? Router.asPath.includes("/login")
        : req?.url?.includes("/login"))
    ) {
      process.browser
        ? Router.push("/login")
        : res.writeHead(302, { Location: "/login" }).end();
      return;
    }

    if (Component.getInitialProps) {
      return { pageProps: await Component.getInitialProps(ctx), user };
    }
    return { pageProps: {}, user };
  }

  render() {
    const { Component, pageProps, user } = this.props;

    return (
      <>
        <Head>
          <title>転職ドラフト候補者を見る</title>
        </Head>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              onClick={() => this.setState({ isOpen: true })}
              edge="start"
              color="inherit"
              aria-label="menu"
            >
              <Menu />
            </IconButton>
            <Link href="/">
              <Typography
                style={{ flexGrow: 1, cursor: "pointer" }}
                component="a"
                color="inherit"
                variant="h6"
              >
                転ドラ候補者を見る
              </Typography>
            </Link>
            {user ? (
              <Button onClick={() => logout()} color="inherit">
                {user.loginId}
              </Button>
            ) : (
              <Link href="/login">
                <Button color="inherit">{"Login"}</Button>
              </Link>
            )}
          </Toolbar>
        </AppBar>
        <Container>
          <div style={{ marginTop: "16px" }}>
            <Component {...pageProps} />
          </div>
        </Container>
        <Drawer
          open={this.state.isOpen}
          onClose={() => this.setState({ isOpen: false })}
        >
          <List style={{ width: 250 }}>
            <Link href="/candidates">
              <ListItem button onClick={() => this.setState({ isOpen: false })}>
                <ListItemIcon>
                  <People />
                </ListItemIcon>
                <ListItemText primary="候補者一覧" />
              </ListItem>
            </Link>
          </List>
        </Drawer>
      </>
    );
  }
}
