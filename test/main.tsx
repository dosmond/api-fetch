import React from "react";
import { ApiDefinition, ApiProvider } from "../src/lib/api-fetch";
import { Consumer } from "./Consumer";
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {},
  },
});


type SignupRequest = { username: string; password: string };
type SignupResponse = { token: string };

const fetchEndpoints = {
  "v1/auth/signup": {} as ApiDefinition<SignupRequest, SignupResponse>,
  "v1/auth/login": {} as ApiDefinition<
    { username: string; password: string },
    { token: string }
  >
} as const;


const App = () => {
  return (
    <ApiProvider baseUrl="http://localhost:3000" queryClient={queryClient} onError={(err) => {
      console.log(err);
    }}>
      <Consumer />
    </ApiProvider>
  );
};

export default App;
