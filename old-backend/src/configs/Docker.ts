//@ts-ignore
import dockerOpts from "dockerode-options";
import Docker from "dockerode";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
const docker = new Docker({ socketPath: "//./pipe/docker_engine" });

// const options = dockerOpts();
// const docker = new Docker(options);

// docker.listContainers((err, containers) => {
//   if (err) {
//     console.error("Error connecting to remote Docker daemon:", err);
//   } else {
//     console.log("Containers running on remote host:", containers);
//   }
// });

export default docker;