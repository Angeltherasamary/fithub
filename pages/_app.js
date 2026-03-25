import "../styles/globals.scss";
import "../styles/services.scss";
import Chatbot from "../components/Chatbot";
import BmiCalculator from "../components/BmiCalculator";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <BmiCalculator />
      <Chatbot />
    </>
  );
}

export default MyApp;
