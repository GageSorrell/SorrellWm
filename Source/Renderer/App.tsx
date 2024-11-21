import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../Resource/icon.svg';
import './App.css';
import { useEffect, useRef, useState, type EffectCallback } from 'react';
import { ipcRenderer } from 'electron';

function Hello() {
    const [ BackgroundImage, SetBackgroundImage ] = useState<string>("");
    // const [ height, SetHeight ] = useState<number>(200);
    // const [ width, SetWidth ] = useState<number>(200);
    const HasLoadedBackgroundImage = useRef<boolean>(false);
    const BackgroundImageElement = useRef<HTMLImageElement>(null);
    useEffect((): void =>
    {
        window.electron.ipcRenderer.on("BackgroundImage", (Event: Electron.IpcRendererEvent) =>
        {
            console.log("Received image!");
            SetBackgroundImage((_Old: string): string => Event as unknown as string);
        });

        console.log("Adding load event listener");
        BackgroundImageElement.current?.addEventListener("load", (): void =>
        {
            // window.electron.ipcRenderer.sendMessage("BackgroundImageBack", "Inside listener");
            if (!HasLoadedBackgroundImage.current)
            {
                console.log("Image has been loaded!");
                HasLoadedBackgroundImage.current = true;
                window.electron.ipcRenderer.sendMessage("BackgroundImage");
            }
        });
    }, [ ]);

    return (
        <div>
            <img src={ BackgroundImage } style={{ width: "100%", height: "100%" }} ref={ BackgroundImageElement }/>
      {/* <div className="Hello">
        <img width="200" alt="icon" src={icon} />
      </div>
      <h1>electron-react-boilerplate</h1>
      <div className="Hello">
        <a
          href="https://electron-react-boilerplate.js.org/"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="books">
              📚
            </span>
            Read our docs
          </button>
        </a>
        <a
          href="https://github.com/sponsors/electron-react-boilerplate"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="folded hands">
              🙏
            </span>
            Donate
          </button>
        </a>
      </div> */}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
