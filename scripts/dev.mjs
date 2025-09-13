import { spawn } from "node:child_process";

const host = process.env.HOST || "localhost";
const args = ["dev", "-H", host];

const child = spawn("next", args, {
	stdio: "inherit",
	shell: true,
	env: process.env,
});

child.on("exit", (code) => {
	process.exit(code ?? 0);
});