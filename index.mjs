#!/usr/bin/env node

import chalk from "chalk";
import boxen from "boxen";
import inquirer from "inquirer";
import open from "open";
import fs from "fs";
import os from "os";
import path from "path";
import axios from "axios";

const newline = "\n";
const label = (text) => chalk.bold.white(text.padEnd(14));

const data = {
  name: chalk.bold.white("Prasid Mandal"),
  title: chalk.gray("Web Developer & CSE Student"),
  github: chalk.white("https://github.com/xodivorce"),
  linkedin: chalk.white("https://linkedin.com/in/xodivorce"),
  instagram: chalk.white("https://instagram.com/xodivorce"),
  web: chalk.white("https://www.xodivorce.in"),
  card: chalk.gray("npx") + " " + chalk.bold.white("xodivorce"),
  email: "prasidmandal79@gmail.com",
  tagline: chalk.gray("On A Mission To, Make The Web More Interesting.."),
};

const content = [
  `${data.name}`,
  `${data.title}`,
  ``,
  `${label("GitHub:")} ${data.github}`,
  `${label("LinkedIn:")} ${data.linkedin}`,
  `${label("Instagram:")} ${data.instagram}`,
  `${label("Website:")} ${data.web}`,
  ``,
  `${label("Install:")} ${data.card}`,
  ``,
  `${data.tagline}`,
].join(newline);

const boxed = boxen(content, {
  margin: 2,
  padding: { top: 1, bottom: 1, left: 12, right: 12 },
  borderStyle: "single",
  borderColor: "white",
  backgroundColor: "black",
});

console.log(boxed);

process.on("SIGINT", () => {
  console.log("\n" + chalk.bold.white("Exited gracefully."));
  process.exit(0);
});

inquirer
  .prompt([
    {
      type: "list",
      name: "action",
      message: chalk.bold.white("Select an option:"),
      choices: [
        {
          name: chalk.white("📧  Send Email"),
          value: async () => {
            try {
              console.log(chalk.gray("→ Opening email client..."));
              await open("mailto:" + data.email);
              console.log(chalk.green("✔ Email client opened."));
            } catch (error) {
              console.error(
                chalk.red("✖ Failed to open email client:"),
                chalk.gray(error?.message || "Unknown error")
              );
            }
          },
        },
        {
          name: chalk.white("📄  View Resume"),
          value: async () => {
            const url = "https://xodivorce.in/core/pdf_config.php";
            const filePath = path.join(os.tmpdir(), "Prasid-mandal-resume.pdf");

            try {
              console.log(chalk.gray("→ Downloading resume..."));

              const response = await axios({
                url,
                method: "GET",
                responseType: "stream",
              });

              const writer = fs.createWriteStream(filePath);
              response.data.pipe(writer);

              await new Promise((resolve, reject) => {
                writer.on("finish", resolve);
                writer.on("error", reject);
              });

              console.log(chalk.green("✔ Resume downloaded."));
              console.log(chalk.gray("→ Opening resume..."));

              await open(filePath);

              console.log(chalk.green("✔ Resume opened locally."));
            } catch (error) {
              console.error(
                chalk.red("✖ Failed to download/open resume:"),
                chalk.gray(error?.message || "Unknown error")
              );
            }
          },
        },
        {
          name: chalk.white("📅  Setup Meeting"),
          value: async () => {
            try {
              console.log(chalk.gray("→ Opening calendar..."));
              await open("https://cal.com/xodivorce");
              console.log(
                chalk.green("✔ Calendar opened in your default browser.")
              );
            } catch (error) {
              console.error(
                chalk.red("✖ Failed to open calendar:"),
                chalk.gray(error?.message || "Unknown error")
              );
            }
          },
        },
        {
          name: chalk.gray("x   Exit"),
          value: () => {
            console.log("");
            console.log(chalk.bold.white("Thank you!"));
            console.log(chalk.gray("Have a great day."));
            console.log("");
            process.exit(0);
          },
        },
      ],
      pageSize: 5,
    },
  ])
  .then(async (answer) => {
    if (typeof answer.action === "function") {
      await answer.action();
    }
  })
  .catch((error) => {
    console.error(
      chalk.red("✖ Unexpected error occurred:"),
      chalk.gray(error?.message || "Unknown error")
    );
    process.exit(1);
  });