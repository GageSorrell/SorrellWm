import { spawnSync } from "node:child_process";
import {
    mkdirSync,
    rmSync,
    writeFileSync
} from "node:fs";
import { createRequire } from "node:module";
import {
    dirname,
    delimiter,
    join
} from "node:path";
import { fileURLToPath } from "node:url";

const Require = createRequire(import.meta.url);
const Directory = dirname(fileURLToPath(import.meta.url));
const Candidates = [
    process.env.npm_config_python,
    process.env.PYTHON,
    "python3",
    "python",
    ...(process.platform === "win32"
        ? [ "C:\\Strawberry\\c\\lib\\python3.9\\venv\\scripts\\nt\\python.exe" ]
        : [])
].filter((Value) => typeof Value === "string");
const Python = Candidates.find((Candidate) =>
    spawnSync(Candidate, [ "--version" ], { stdio: "ignore" }).status === 0);

if (Python === undefined)
{
    console.error("A Python 3 installation is required to build the native log fixture.");
    process.exitCode = 1;
}
else
{
    let NodeGypPython = Python;
    const TemporaryFiles = [];
    const ReportedExecutable = spawnSync(Python, [
        "-c",
        "import sys; print(sys.executable)"
    ], { encoding: "utf8" }).stdout.trim();

    if (process.platform === "win32" && ReportedExecutable.endsWith(".dll"))
    {
        const Source = join(Directory, ".node-gyp-python.cpp");
        const Wrapper = join(Directory, ".node-gyp-python.exe");
        const PythonLiteral = Python.replaceAll("\\", "\\\\").replaceAll("\"", "\\\"");
        const Version = spawnSync(Python, [
            "-c",
            "import sys; print('%s.%s.%s' % sys.version_info[:3])"
        ], { encoding: "utf8" }).stdout.trim();
        writeFileSync(
            Source,
            [
                "#include <process.h>",
                "#include <windows.h>",
                "#include <iostream>",
                "#include <string>",
                "#include <vector>",
                "int wmain(int argc, wchar_t** argv) {",
                "  for (int i = 1; i < argc; ++i) {",
                "    if (std::wstring(argv[i]).find(L\"sys.executable\") != std::wstring::npos) {",
                "      wchar_t path[MAX_PATH];",
                "      GetModuleFileNameW(nullptr, path, MAX_PATH);",
                "      std::wcout << path << std::endl;",
                "      return 0;",
                "    }",
                "    if (std::wstring(argv[i]).find(L\"sys.version_info\") != std::wstring::npos) {",
                `      std::wcout << L\"${ Version }\" << std::endl;`,
                "      return 0;",
                "    }",
                "  }",
                `  const wchar_t* python = L\"${ PythonLiteral }\";`,
                "  std::vector<const wchar_t*> arguments;",
                "  arguments.push_back(python);",
                "  for (int i = 1; i < argc; ++i) arguments.push_back(argv[i]);",
                "  arguments.push_back(nullptr);",
                "  return _wspawnv(_P_WAIT, python, arguments.data());",
                "}"
            ].join("\n")
        );
        const Compiler = "C:\\Strawberry\\c\\bin\\g++.exe";
        const Compile = spawnSync(Compiler, [
            "-std=c++20",
            "-municode",
            Source,
            "-o",
            Wrapper
        ], { stdio: "inherit" });
        if (Compile.status !== 0)
        {
            rmSync(Source, { force: true });
            process.exit(Compile.status ?? 1);
        }

        TemporaryFiles.push(Source, Wrapper);
        NodeGypPython = Wrapper;
    }

    const NodeGyp = Require.resolve("node-gyp/bin/node-gyp.js");
    const StubDirectory = join(Directory, ".python-stubs");
    mkdirSync(StubDirectory, { recursive: true });
    writeFileSync(join(StubDirectory, "ctypes.py"), "# Unused by the MSVS generator.\n");
    TemporaryFiles.push(StubDirectory);
    const Result = spawnSync(process.execPath, [
        NodeGyp,
        "rebuild",
        "--directory",
        Directory,
        "--enable-thin-lto=false",
        "--enable-lto=false",
        "--lto-jobs=",
        `--python=${ NodeGypPython }`
    ], {
        env: {
            ...process.env,
            PYTHONPATH: [
                StubDirectory,
                process.env.PYTHONPATH
            ].filter(Boolean).join(delimiter)
        },
        stdio: "inherit"
    });
    for (const File of TemporaryFiles)
    {
        rmSync(File, { force: true, recursive: true });
    }
    process.exitCode = Result.status ?? 1;
}
