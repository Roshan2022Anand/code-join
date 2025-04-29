import internal from "stream";

export type langKey = "javascript" | "python" | "java" | "go" | "c" | "cpp";

export type LangInfoType = {
  env: string;
  code: string;
  runCmd: string;
};

//type for rooms object
export type Room = Map<
  string,
  {
    containerID: string;
    stream: internal.Duplex;
    // chats:[],
    lang: langKey;
    members: Map<string, { name: string; profile: string }>;
  }
>;

export const languages: Record<langKey, LangInfoType> = {
  javascript: {
    env: "node",
    code: `// Have fun coding!! 😃\nconsole.log("roshan is cool");`,
    runCmd: "node main",
  },
  python: {
    env: "python",
    code: `# Have fun coding!! 😃\nprint("roshan is cool")`,
    runCmd: "python3 main",
  },
  java: {
    env: "java",
    code: `// Have fun coding!! 😃\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("roshan is cool");\n    }\n}`,
    runCmd: "java main",
  },
  go: {
    env: "go",
    code: `// Have fun coding!! 😃\npackage main\nimport "fmt"\n\nfunc main() {\n    fmt.Println("roshan is cool")\n}`,
    runCmd: "go run main",
  },
  c: {
    env: "c",
    code: `// Have fun coding!! 😃\n#include <stdio.h>\n\nint main() {\n    printf("roshan is cool");\n    return 0;\n}`,
    runCmd: "gcc main -o main && ./main",
  },
  cpp: {
    env: "cpp",
    code: `// Have fun coding!! 😃\n#include <iostream>\n\nint main() {\n    std::cout << "roshan is cool";\n    return 0;\n}`,
    runCmd: "g++ main -o main && ./main",
  },
};
