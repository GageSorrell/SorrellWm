/* File:      CheckNativeDependencies.js
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import * as Fs from "fs";
import chalk from "chalk";
import { dependencies } from "../package.json";
import { execSync } from "child_process";

if (dependencies)
{
    const DependenciesKeys: Array<string> = Object.keys(dependencies);
    const NativeDeps: Array<string> = Fs
        .readdirSync("node_modules")
        .filter((folder: string): boolean =>
        {
            return Fs.existsSync(`node_modules/${folder}/binding.gyp`);
        });

    if (NativeDeps.length === 0)
    {
        process.exit(0);
    }
    try
    {
        /* Find the reason for why the dependency is installed. If it is installed *
         * because of a devDependency then that is okay. Warn when it is installed *
         * because of a dependency.                                                */
        const { dependencies: dependenciesObject } = JSON.parse(
            execSync(`npm ls ${NativeDeps.join(" ")} --json`).toString()
        );

        const RootDependencies: Array<string> = Object.keys(dependenciesObject);
        const FilteredRootDependencies: Array<string> =
            RootDependencies.filter((RootDependency: string): boolean =>
            {
                return DependenciesKeys.includes(RootDependency);
            });

        if (FilteredRootDependencies.length > 0)
        {
            const Plural: boolean = FilteredRootDependencies.length > 1;
            /* eslint-disable-next-line @stylistic/max-len */
            console.log(`\n ${chalk.whiteBright.bgYellow.bold("Webpack does not work with native dependencies.")}\n${ chalk.bold(FilteredRootDependencies.join(", ")) } ${ Plural ? "are native dependencies" : "is a native dependency" } and should be installed inside of the "./Release/Application" folder.\nFirst, uninstall the packages from "./package.json": ${ chalk.whiteBright.bgGreen.bold("npm uninstall your-package") }\n ${ chalk.bold("Then, instead of installing the package to the root \"./package.json\":") }\n ${ chalk.whiteBright.bgRed.bold("npm install your-package") }\n${ chalk.bold("Install the package to \"./Release/Application/package.json\"") }\n ${ chalk.whiteBright.bgGreen.bold("cd ./Release/Application && npm install your-package") }\n Read more about native dependencies at:\n${ chalk.bold("https://electron-react-boilerplate.js.org/docs/adding-dependencies/#module-structure") }\n`);
            process.exit(1);
        }
    }
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    catch (_Error: unknown)
    {
        console.log("Native dependencies could not be checked");
    }
}
