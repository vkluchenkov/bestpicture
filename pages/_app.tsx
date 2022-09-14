import "../styles/vendor/fonts/inter.css";
import "../styles/vendor/normalize.css";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Header } from "../components/Header";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
