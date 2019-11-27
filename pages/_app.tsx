import App, { AppContext } from "next/app";

import "./_app.css";
import { AppBar, Toolbar, IconButton, Typography, Button, Container } from "@material-ui/core";
import { Menu } from "@material-ui/icons";

export default class MyApp extends App {
  static async getInitialProps({ Component, ctx }: AppContext) {
    if (Component.getInitialProps) {
      return { pageProps: await Component.getInitialProps(ctx) };
    }
    return { pageProps: {} };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Menu />
          </IconButton>
          <Typography style={{ flexGrow: 1 }} variant="h6" >
            転ドラの候補者を管理する
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <Container fixed>
        <Component {...pageProps} />
      </Container>
      </>
    );
  }
}
