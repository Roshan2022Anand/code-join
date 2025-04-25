import Docker from "dockerode";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// Paths to SSH certificates
const SSH_KEY_PATH = path.join(__dirname, "../../certs/id_rsa");
const SSH_CERT_PATH = path.join(__dirname, "../../certs/id_rsa-cert.pub");

// Azure VM connection details
const AZURE_VM_HOST = process.env.AZURE_VM_HOST || "your-azure-vm-host";
const AZURE_VM_PORT = process.env.AZURE_VM_PORT || "22";
const AZURE_VM_USER = process.env.AZURE_VM_USER || "azureuser";

// Check if SSH certificates exist
if (!fs.existsSync(SSH_KEY_PATH)) {
  console.error(`SSH private key not found at: ${SSH_KEY_PATH}`);
  process.exit(1);
}

if (!fs.existsSync(SSH_CERT_PATH)) {
  console.error(`SSH certificate not found at: ${SSH_CERT_PATH}`);
  process.exit(1);
}

// Docker connection options
const dockerOptions: Docker.DockerOptions = {
  host: AZURE_VM_HOST,
  port: AZURE_VM_PORT,
  username: AZURE_VM_USER,
  protocol: "ssh" as const,
  sshOptions: {
    host: AZURE_VM_HOST,
    port: parseInt(AZURE_VM_PORT),
    username: AZURE_VM_USER,
    privateKey: fs.readFileSync(SSH_KEY_PATH),
    passphrase: process.env.SSH_PASSPHRASE || undefined,
  },
};

// Create Docker instance
const docker = new Docker(dockerOptions);

// Test connection
docker.info((err, info) => {
  if (err) {
    console.error("Error connecting to Docker daemon:", err);
  } else {
    console.log("Successfully connected to Docker daemon");
    console.log("Docker info:", info);
  }
});

export default docker;