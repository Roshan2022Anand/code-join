export type langKey = "NodeJS" | "python" | "java" | "go" | "c" | "cpp";

export type LangInfoType = {
  env: string;
  code: string;
  ext: string;
};

//type for rooms object
export type Room = {
  [roomID: string]: {
    containerID: string;
    members: { [socketID: string]: { name: string; profile: string } };
  };
};