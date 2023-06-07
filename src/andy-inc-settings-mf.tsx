import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import Settings from ".";
import { ApiProvider } from "./context";

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: (props) => (
    <ApiProvider>
      <Settings />
    </ApiProvider>
  ),
  errorBoundary(err, info, props) {
    // Customize the root error boundary for your microfrontend here.
    return null;
  },
});

export const { bootstrap, mount, unmount } = lifecycles;
