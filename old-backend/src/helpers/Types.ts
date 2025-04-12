import internal from "stream";

export type langKey = "NodeJS" | "python" | "java" | "go" | "c" | "cpp";

export type LangInfoType = {
  env: string;
  code: string;
  ext: string;
};

//type for rooms object
export type Room = Map<
  string,
  {
    containerID: string;
    streams: internal.Duplex[];
    members: Map<string, { name: string; profile: string; currFile: string|null }>;
  }
>;
