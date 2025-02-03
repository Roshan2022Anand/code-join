export type langKey =
  | "javascript"
  | "typescript"
  | "python"
  | "java"
  | "go"
  | "c"
  | "cpp";
export const languagesOpt: Record<langKey, string> = {
  javascript: "// Have fun coding!! 😃\nconsole.log('roshan is cool');",
  typescript: "// Have fun coding!! 😃\nconsole.log('roshan is cool');",
  python: "# Have fun coding!! 😃\nprint('roshan is cool')",
  java: '// Have fun coding!! 😃\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("roshan is cool");\n    }\n}',
  go: '// Have fun coding!! 😃\npackage main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("roshan is cool")\n}',
  c: '// Have fun coding!! 😃\n#include <stdio.h>\n\nint main() {\n    printf("roshan is cool\\n");\n    return 0;\n}',
  cpp: '// Have fun coding!! 😃\n#include <iostream>\n\nint main() {\n    std::cout << "roshan is cool" << std::endl;\n    return 0;\n}',
};