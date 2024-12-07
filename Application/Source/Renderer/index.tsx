import { Log } from "./Api";
import { App, Main, TestWindow } from "./App";
import { type Root, createRoot } from "react-dom/client";

const Container: HTMLElement = document.getElementById("root") as HTMLElement;
const Root: Root = createRoot(Container);

Root.render(<App />);
// const Url: URL = new URL(document.URL);

// Log("document.URL", document.URL);

// /* eslint-disable-next-line @stylistic/max-len */
// /** @TODO Build system where components are registered as pages, with a string union type that contains the list of all pages so that they can be ref'd by name (string). */
// const PageName: string | null = Url.searchParams.get("Component");
// if (PageName !== null)
// {
//     if (PageName === "Main")
//     {
//         window.electron.ipcRenderer.sendMessage("Log", "Inside: Main");
//         Root.render(<Main />);
//     }
//     else
//     {
//         window.electron.ipcRenderer.sendMessage("Log", "Inside: TestWindow");
//         Root.render(<TestWindow />);
//     }
// }
// else
// {
//     window.electron.ipcRenderer.sendMessage("Log", "Outside: TestWindow");
//     Root.render(<TestWindow />);
// }
