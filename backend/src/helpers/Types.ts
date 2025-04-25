export type langKey = "node" | "python" | "java" | "go" | "c" | "cpp";

export type LangInfoType = {
  env: string;
  code: string;
};

//type for rooms object
export type Room = Map<
  string,
  {
    containerID: string;
    members: Map<string, { name: string; profile: string }>;
  }
>;
