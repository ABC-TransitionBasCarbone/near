import "dotenv/config";
import { initSuBank } from "~/server/suBank/init";
import suBankData from "./su-bank.json";

await initSuBank(suBankData)
  .catch((e) => {
    if (e instanceof Error) {
      console.error(e.message);
    } else {
      console.error(e);
    }
    process.exit(1);
  })
  .then(() => {
    console.log("End su_bank init successfully");
    process.exit(0);
  });
