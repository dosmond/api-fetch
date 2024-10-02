import React from "react";
import { useFetch } from "../src/lib/api-fetch";
import { FetchEndpoints } from "./endpoints/auth";


export const Consumer = () => {
  const { data, isLoading } = useFetch<FetchEndpoints>("v1/auth/login", { username: "test", password: "test" })


  return <div>Internal App</div>;
};
