import App, { AppContext } from "next/app";
import "./_app.css";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Container,
  Link,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from "@material-ui/core";
import { Menu, People } from "@material-ui/icons";
import { execIdentify, execLogout, origin } from "../api/Client";

interface Props {
  user: { loginId: string };
}

async function identify(origin: string, cookies: string) {
  const result = await execIdentify(origin, cookies);
  if (result.ok) {
    return await result.json();
  }
  return null;
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
  static async getInitialProps({ Component, ctx }: AppContext) {
    const { req } = ctx;
    const { cookie } = req.headers;
    console.log(cookie);
    const user = await identify(origin(req), cookie);
    if (Component.getInitialProps) {
      return { pageProps: await Component.getInitialProps(ctx), user };
    }
    return { pageProps: {}, user };
  }

  render() {
    const { Component, pageProps, user } = this.props;

    return (
      <>
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
            <Link style={{ flexGrow: 1 }} color="inherit" href="/">
              <Typography variant="h6">転ドラ候補者を見る</Typography>
            </Link>
            {user ? (
              <Button onClick={() => logout()} color="inherit">
                {user.loginId}
              </Button>
            ) : (
              <Button href="/login" color="inherit">
                {"Login"}
              </Button>
            )}
          </Toolbar>
        </AppBar>
        <Drawer
          open={this.state.isOpen}
          onClose={() => this.setState({ isOpen: false })}
        >
          <List style={{ width: 250 }}>
            <ListItem component="a" button href="/candidates">
              <ListItemIcon>
                <People />
              </ListItemIcon>
              <ListItemText primary="候補者一覧" />
            </ListItem>
          </List>
        </Drawer>
        <Container>
          <div style={{ marginTop: "16px" }}>
            <Component {...pageProps} />
          </div>
        </Container>
      </>
    );
  }
}
