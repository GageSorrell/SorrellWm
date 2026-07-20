// const annotateLine = (line: string): string => Ansi.annotate(line, Ansi.bold);
// const annotateErrorLine = (line: string): string =>
//     Ansi.annotate(line, Ansi.combine(Ansi.italicized, Ansi.red));

// /**
//  * Clears all lines taken up by the specified `text`.
//  */
// const eraseText = (_text: string, columns: number): string =>
// {
//     if (columns === 0)
//     {
//         return "";
//         // return Ansi.eraseLine + Ansi.cursorTo(0);
//     }
//     // let rows: number = 0;
//     // const lines: Array<string> = text.split(NEWLINE_REGEXP);
//     // for (const line of lines)
//     // {
//     //     rows += 1 + Math.floor(Math.max(line.length - 1, 0) / columns);
//     // }
//     return "";
//     // return Ansi.eraseLines(rows);
// };

// const lines = (prompt: string, columns: number): number =>
// {
//     const lines: Array<string> = prompt.split(NEWLINE_REGEXP);
//     return columns === 0
//         ? lines.length
//         : pipe(
//             Arr.map(lines, (line: string) => Math.ceil(line.length / columns)),
//             Arr.reduce(0, (left: number, right: number) => left + right)
//         );
// };

// const clearOutputWithError = (outputText: string, columns: number, errorText?: string): string =>
// {
//     if (errorText !== undefined && errorText.length > 0)
//     {
//         return "";
//     //     return Ansi.cursorDown(lines(errorText, columns))
//     //   + eraseText(`\n${errorText}`, columns)
//     //   + eraseText(outputText, columns);
//     }

//     return eraseText(outputText, columns);
// };

// const renderNoOp: string = ""; // = Ansi.beep;

// const NEWLINE_REGEXP: RegExp = /\r?\n/;

// const handleConfirmClear = (options: ConfirmOptionsReq) =>
// {
//     return Effect.fnUntraced(function*(
//         state: Internal.ConfirmState,
//         _: Action<Internal.ConfirmState, boolean>
//     )
//     {
//         const terminal: Terminal.Terminal = yield* Terminal.Terminal;
//         const columns: number = yield* terminal.columns;
//         const figures: Figures = yield* PlatformFigures;
//         const confirmMessage: string = state.value
//             ? options.placeholder.defaultConfirm!
//             : options.placeholder.defaultDeny!;
//         const promptText: string = renderConfirmOutput(
//             confirmMessage,
//             "?",
//             figures.pointerSmall,
//             options,
//             { plain: true }
//         );
//         const clearOutput: string = eraseText(promptText, columns);
//         const resetCurrentLine: string = ""; // = Ansi.eraseLine + Ansi.cursorLeft;
//         return clearOutput + resetCurrentLine;
//     });
// };

// const renderConfirmOutput = (
//     confirm: string,
//     leadingSymbol: string,
//     trailingSymbol: string,
//     options: ConfirmOptionsReq,
//     renderOptions?: RenderOptions | undefined
// ) => renderPrompt(confirm, options.message, leadingSymbol, trailingSymbol, renderOptions);

// const renderConfirmNextFrame: {
//     (state: Internal.ConfirmState,
//         options: ConfirmOptionsReq
//     ): Effect.Effect<string, never, never>;
// } = Effect.fnUntraced(function*(state: Internal.ConfirmState, options: ConfirmOptionsReq)
// {
//     const figures: Figures = yield* PlatformFigures;
//     const leadingSymbol: string = "?"; // = Ansi.annotate("?", Ansi.cyanBright);
//     const trailingSymbol: string = figures.pointerSmall;
//     // = Ansi.annotate(figures.pointerSmall, Ansi.blackBright);
//     // Marking these explicitly as present with `!` because they always will be
//     // and there is really no value in adding a `DeepRequired` type helper just
//     // for these internal cases
//     const confirmMessage: string = state.value
//         ? options.placeholder.defaultConfirm!
//         : options.placeholder.defaultDeny!;
//     const confirm: string = confirmMessage; // = Ansi.annotate(confirmMessage, Ansi.blackBright);
//     const promptMsg: string = renderConfirmOutput(confirm, leadingSymbol, trailingSymbol, options);
//     return promptMsg;
//     // return Ansi.cursorHide + promptMsg;
// });

// const renderConfirmSubmission: {
//     (value: boolean,
//         options: ConfirmOptionsReq): Effect.Effect<string, never, never>;
// } = Effect.fnUntraced(function*(value: boolean, options: ConfirmOptionsReq)
// {
//     const figures: Figures = yield* PlatformFigures;
//     const leadingSymbol: string = figures.tick;// = Ansi.annotate(figures.tick, Ansi.green);
//     const trailingSymbol: string = figures.ellipsis;// = Ansi.annotate(figures.ellipsis, Ansi.blackBright);
//     const confirmMessage: string = value ? options.label.confirm : options.label.deny;
//     const promptMsg: string = renderConfirmOutput(confirmMessage, leadingSymbol, trailingSymbol, options);
//     return promptMsg + "\n";
// });

// const handleConfirmRender = (options: ConfirmOptionsReq) =>
// {
//     return (_: Internal.ConfirmState, action: Action<Internal.ConfirmState, boolean>) =>
//     {
//         return Action.$match(action, {
//             NextFrame: ({ State: state }: { State: Internal.ConfirmState; }) =>
//                 renderConfirmNextFrame(state, options),
//             NoOp: () => Effect.succeed(renderNoOp),
//             Submit: ({ value: value }: { value: boolean; }) => renderConfirmSubmission(value, options)
//         });
//     };
// };

// const handleDateClear = (options: DateOptionsReq) =>
// {
//     return Effect.fnUntraced(function*(
//         state: Internal.DateState,
//         _: Action<Internal.DateState, globalThis.Date>
//     )
//     {
//         const terminal: Terminal.Terminal = yield* Terminal.Terminal;
//         const columns: number = yield* terminal.columns;
//         const figures: Figures = yield* PlatformFigures;
//         const resetCurrentLine: string = "";// = Ansi.eraseLine + Ansi.cursorLeft;
//         const parts: string = Arr.reduce(
//             state.dateParts,
//             "",
//             (doc: string, part: Internal.DatePart) => doc + part.toString()
//         );
//         const promptText: string = renderDateOutput(
//             "?",
//             figures.pointerSmall,
//             parts,
//             options,
//             { plain: true }
//         );
//         const errorText: string = Option.isSome(state.error)
//             ? Arr.match(state.error.value.split(NEWLINE_REGEXP), {
//                 onEmpty: () => "",
//                 onNonEmpty: (errorLines: Arr.NonEmptyReadonlyArray<string>) =>
//                     `${ figures.pointerSmall } ${ errorLines.join("\n") }`
//             })
//             : "";
//         const clearOutput: string = clearOutputWithError(promptText, columns, errorText);
//         return clearOutput + resetCurrentLine;
//     });
// };

// const renderDateError = (state: Internal.DateState, _pointer: string): string =>
// {
//     if (Option.isSome(state.error))
//     {
//         const errorLines: Array<string> = state.error.value.split(NEWLINE_REGEXP);
//         if (Arr.isReadonlyArrayNonEmpty(errorLines))
//         {
//             const prefix: string = ""; // = Ansi.annotate(pointer, Ansi.red) + " ";
//             const lines: Arr.NonEmptyArray<string> =
//                 Arr.map(errorLines, (str: string) => str); // annotateErrorLine(str));
//             return "\n" + prefix + lines.join("\n");
//             // return Ansi.cursorSavePosition + "\n" + prefix + lines.join("\n") +
//             //     Ansi.cursorRestorePosition;
//         }
//     }
//     return "";
// };

// const renderParts = (state: Internal.DateState, submitted: boolean = false) =>
// {
//     return Arr.reduce(
//         state.dateParts,
//         "",
//         (doc: string, part: Internal.DatePart, currentIndex: number) =>
//         {
//             const partDoc: string = part.toString();
//             if (currentIndex === state.cursor && !submitted)
//             {
//                 // const annotation: string = Ansi.combine(Ansi.underlined, Ansi.cyanBright);
//                 // return doc + Ansi.annotate(partDoc, annotation);
//                 return doc;
//             }
//             return doc + partDoc;
//         }
//     );
// };

// const renderDateOutput = (
//     leadingSymbol: string,
//     trailingSymbol: string,
//     parts: string,
//     options: DateOptionsReq,
//     renderOptions?: RenderOptions | undefined
// ) => renderPrompt(parts, options.message, leadingSymbol, trailingSymbol, renderOptions);

// const renderDateNextFrame: {
//     (state: Internal.DateState,
//         options: DateOptionsReq): Effect.Effect<string, never, never>;
// } = Effect.fnUntraced(function*(state: Internal.DateState, options: DateOptionsReq)
// {
//     const figures: Figures = yield* PlatformFigures;
//     const leadingSymbol: string = "?";// = Ansi.annotate("?", Ansi.cyanBright);
//     const trailingSymbol: string = figures.pointerSmall;
//     // = Ansi.annotate(figures.pointerSmall, Ansi.blackBright);
//     const parts: string = renderParts(state);
//     const promptMsg: string = renderDateOutput(leadingSymbol, trailingSymbol, parts, options);
//     const errorMsg: string = renderDateError(state, figures.pointerSmall);
//     return promptMsg + errorMsg;
//     // return Ansi.cursorHide + promptMsg + errorMsg;
// });

// const renderDateSubmission: {
//     (state: Internal.DateState,
//         options: DateOptionsReq): Effect.Effect<string, never, never>;
// } = Effect.fnUntraced(function*(state: Internal.DateState, options: DateOptionsReq)
// {
//     const figures: Figures = yield* PlatformFigures;
//     const leadingSymbol: string = figures.tick;// = Ansi.annotate(figures.tick, Ansi.green);
//     const trailingSymbol: string = figures.ellipsis;// = Ansi.annotate(figures.ellipsis, Ansi.blackBright);
//     const parts: string = renderParts(state, true);
//     const promptMsg: string = renderDateOutput(leadingSymbol, trailingSymbol, parts, options);
//     return promptMsg + "\n";
// });

// const processUp = (state: Internal.DateState) =>
// {
//     state.dateParts[state.cursor].increment();
//     return Action.NextFrame({
//         State:
//         {
//             ...state,
//             typed: ""
//         }
//     });
// };

// const processDown = (state: Internal.DateState) =>
// {
//     state.dateParts[state.cursor].decrement();
//     return Action.NextFrame({
//         State:
//         {
//             ...state,
//             typed: ""
//         }
//     });
// };

// const processDateCursorLeft = (state: Internal.DateState) =>
// {
//     const previous: Option.Option<Internal.DatePart> = state.dateParts[state.cursor].previousPart();
//     if (Option.isSome(previous))
//     {
//         return Action.NextFrame({
//             State:
//             {
//                 ...state,
//                 cursor: state.dateParts.indexOf(previous.value),
//                 typed: ""
//             }
//         });
//     }

//     return Action.NoOp();
// };

// const processDateCursorRight = (state: Internal.DateState) =>
// {
//     const next: Option.Option<Internal.DatePart> = state.dateParts[state.cursor].nextPart();
//     if (Option.isSome(next))
//     {
//         return Action.NextFrame({
//             State:
//             {
//                 ...state,
//                 cursor: state.dateParts.indexOf(next.value),
//                 typed: ""
//             }
//         });
//     }

//     return Action.NoOp();
// };

// const processDateNext = (state: Internal.DateState) =>
// {
//     const next: Option.Option<Internal.DatePart> = state.dateParts[state.cursor].nextPart();
//     const cursor: number = Option.match(next, {
//         onNone: () => state.dateParts.findIndex((part: Internal.DatePart) => !part.isToken()),
//         onSome: (next: Internal.DatePart) => state.dateParts.indexOf(next)
//     });
//     return Action.NextFrame({
//         State:
//         {
//             ...state,
//             cursor
//         }
//     });
// };

// const defaultDateProcessor = (value: string, state: Internal.DateState) =>
// {
//     if (/\d/.test(value))
//     {
//         const typed: string = state.typed + value;
//         state.dateParts[state.cursor].setValue(typed);
//         return Action.NextFrame({
//             State:
//             {
//                 ...state,
//                 typed
//             }
//         });
//     }
//     return Action.NoOp();
// };

// const handleDateRender = (options: DateOptionsReq) =>
// {
//     return (state: Internal.DateState, action: Action<Internal.DateState, globalThis.Date>) =>
//     {
//         return Action.$match(action, {
//             NextFrame: ({ State: state }: { State: Internal.DateState }) =>
//                 renderDateNextFrame(state, options),
//             NoOp: () => Effect.succeed(renderNoOp),
//             Submit: () => renderDateSubmission(state, options)
//         });
//     };
// };

// const filterFiles = (files: ReadonlyArray<string>, query: string) =>
// {
//     if (query.length === 0)
//     {
//         return files;
//     }
//     const normalizedQuery: string = query.toLowerCase();
//     const filtered: Array<string> = [ ];
//     for (let index: number = 0; index < files.length; index++)
//     {
//         if (files[index].toLowerCase().includes(normalizedQuery))
//         {
//             filtered.push(files[index]);
//         }
//     }
//     return filtered;
// };

// const updateFileState = (
//     state: Internal.FileState,
//     query: string,
//     allFiles: ReadonlyArray<string> = state.allFiles
// ): Internal.FileState =>
// {
//     const files: ReadonlyArray<string> = filterFiles(allFiles, query);
//     if (files.length === 0)
//     {
//         return { ...state, allFiles, cursor: 0, files, query };
//     }
//     const selected: string = state.files[state.cursor];
//     const cursor: number = selected === undefined ? 0 : files.indexOf(selected);
//     return {
//         ...state,
//         allFiles,
//         cursor: cursor === -1 ? 0 : cursor,
//         files,
//         query
//     };
// };

// const handleFileClear = (options: FileOptionsReq) =>
// {
//     return Effect.fnUntraced(function*(state: Internal.FileState, _: Action<Internal.FileState, string>)
//     {
//         const terminal: Terminal.Terminal = yield* Terminal.Terminal;
//         const columns: number = yield* terminal.columns;
//         const path: Path.Path = yield* Path.Path;
//         const figures: Figures = yield* PlatformFigures;
//         const currentPath: string = yield* resolveCurrentPath(state.path, options);
//         const selectedPath: string = state.files[state.cursor];
//         const resolvedPath: string = selectedPath === undefined
//             ? currentPath
//             : path.resolve(currentPath, selectedPath);
//         const resolvedPathText: string = `${ figures.pointerSmall } ${ resolvedPath }`;
//         const isConfirming: boolean = showConfirmation(state.confirm);
//         const promptText: string = isConfirming
//             ? renderPrompt("(Y/n)", CONFIRM_MESSAGE, "?", figures.pointerSmall, { plain: true })
//             : renderPrompt(
//                 renderFileFilter(state, { plain: true }),
//                 options.message,
//                 figures.tick,
//                 figures.ellipsis,
//                 { plain: true }
//             );
//         const filesText: string = isConfirming
//             ? ""
//             : renderFiles(state, state.files, figures, options, { plain: true });
//         const outputText: string = isConfirming
//             ? `${ promptText }\n${ resolvedPathText }`
//             : `${ promptText }\n${ resolvedPathText }\n${ filesText }`;
//         const clearOutput: string = eraseText(outputText, columns);
//         // const resetCurrentLine: string = Ansi.eraseLine + Ansi.cursorLeft;
//         const resetCurrentLine: string = "";
//         return clearOutput + resetCurrentLine;
//     });
// };

// const renderPrompt = (
//     confirm: string,
//     message: string,
//     leadingSymbol: string,
//     trailingSymbol: string,
//     _options?: RenderOptions | undefined
// ) =>
// {
//     const prefix: string = leadingSymbol + " ";
//     const annotate = (line: string) => line;
//     // const annotate: typeof annotateLine = options?.plain === true
//     //     ? (line: string) => line
//     //     : annotateLine;
//     return Arr.match(message.split(NEWLINE_REGEXP), {
//         onEmpty: () => prefix + " " + trailingSymbol + " " + confirm,
//         onNonEmpty: (promptLines: ReadonlyArray<string>) =>
//         {
//             const lines: ReadonlyArray<string> = Arr.map(promptLines, (line: string) => annotate(line));
//             return prefix + lines.join("\n") + " " + trailingSymbol + " " + confirm;
//         }
//     });
// };

// const renderPrefix = (
//     state: Internal.FileState,
//     toDisplay: { readonly startIndex: number; readonly endIndex: number },
//     currentIndex: number,
//     length: number,
//     figures: Effect.Success<typeof PlatformFigures>,
//     _renderOptions?: RenderOptions | undefined
// ) =>
// {
//     let prefix: string = " ";
//     if (currentIndex === toDisplay.startIndex && toDisplay.startIndex > 0)
//     {
//         prefix = figures.arrowUp;
//     }
//     else if (currentIndex === toDisplay.endIndex - 1 && toDisplay.endIndex < length)
//     {
//         prefix = figures.arrowDown;
//     }

//     if (state.cursor === currentIndex)
//     {
//         return figures.pointer + prefix;
//         // return renderOptions?.plain === true
//         //     ? figures.pointer + prefix
//         //     : Ansi.annotate(figures.pointer, Ansi.cyanBright) + prefix;
//     }

//     return prefix + " ";
// };

// const renderFileName = (file: string, _isSelected: boolean, _renderOptions?: RenderOptions | undefined) =>
// {
//     return file;
//     // if (renderOptions?.plain === true)
//     // {
//     //     return file;
//     // }
//     // return isSelected
//     //     ? Ansi.annotate(file, Ansi.combine(Ansi.underlined, Ansi.cyanBright))
//     //     : file;
// };

// const renderFileFilter = (state: Internal.FileState, _renderOptions?: RenderOptions | undefined) =>
// {
//     // const filterValue = state.query.length === 0
//     //     ? renderOptions?.plain === true
//     //         ? FILE_FILTER_PLACEHOLDER
//     //         : Ansi.annotate(FILE_FILTER_PLACEHOLDER, Ansi.blackBright)
//     //     : renderOptions?.plain === true
//     //         ? state.query
//     //         : Ansi.annotate(state.query, Ansi.combine(Ansi.underlined, Ansi.cyanBright));
//     const filterValue: string = state.query.length === 0
//         ? FILE_FILTER_PLACEHOLDER
//         : state.query;

//     return `[${ FILE_FILTER_LABEL }: ${ filterValue }]`;
// };

// const renderFiles = (
//     state: Internal.FileState,
//     files: ReadonlyArray<string>,
//     figures: Effect.Success<typeof PlatformFigures>,
//     options: FileOptionsReq,
//     renderOptions?: RenderOptions | undefined
// ) =>
// {
//     const length: number = files.length;
//     if (length === 0)
//     {
//         return FILE_EMPTY_MESSAGE;
//         // return renderOptions?.plain === true
//         //     ? FILE_EMPTY_MESSAGE
//         //     : Ansi.annotate(FILE_EMPTY_MESSAGE, Ansi.blackBright);
//     }

//     const toDisplay: { endIndex: number; startIndex: number; }  =
//         entriesToDisplay(state.cursor, length, options.maxPerPage);

//     const documents: Array<string> = [ ];

//     for (let index: number = toDisplay.startIndex; index < toDisplay.endIndex; index++)
//     {
//         const isSelected: boolean = state.cursor === index;
//         const prefix: string = renderPrefix(state, toDisplay, index, length, figures, renderOptions);
//         const fileName: string = renderFileName(files[index], isSelected, renderOptions);
//         documents.push(prefix + fileName);
//     }

//     return documents.join("\n");
// };

// const renderFileNextFrame: {
//     (state: Internal.FileState,
//         options: FileOptionsReq): Effect.Effect<string, never, FileSystem.FileSystem | Path.Path>;
// } = Effect.fnUntraced(function*(state: Internal.FileState, options: FileOptionsReq)
// {
//     const path: Path.Path = yield* Path.Path;
//     const figures: Figures = yield* PlatformFigures;
//     const currentPath: string = yield* resolveCurrentPath(state.path, options);
//     const selectedPath: string = state.files[state.cursor];
//     const resolvedPath: string = selectedPath === undefined
//         ? currentPath
//         : path.resolve(currentPath, selectedPath);
//     const resolvedPathMsg: string = figures.pointerSmall + " " + resolvedPath;
//     // const resolvedPathMsg: string =
//     //     Ansi.annotate(figures.pointerSmall + " " + resolvedPath, Ansi.blackBright);

//     if (showConfirmation(state.confirm))
//     {
//         const leadingSymbol: string = "?";// = Ansi.annotate("?", Ansi.cyanBright);
//         const trailingSymbol: string = figures.pointerSmall;
//         //     = Ansi.annotate(figures.pointerSmall, Ansi.blackBright);
//         const confirm: string = "(Y/n)";// = Ansi.annotate("(Y/n)", Ansi.blackBright);
//         const promptMsg: string = renderPrompt(confirm, CONFIRM_MESSAGE, leadingSymbol, trailingSymbol);
//         return promptMsg + "\n" + resolvedPathMsg;
//         // return Ansi.cursorHide + promptMsg + "\n" + resolvedPathMsg;
//     }

//     const leadingSymbol: string = figures.tick;// = Ansi.annotate(figures.tick, Ansi.green);
//     const trailingSymbol: string = figures.ellipsis;// = Ansi.annotate(figures.ellipsis, Ansi.blackBright);
//     const promptMsg: string =
//         renderPrompt(renderFileFilter(state), options.message, leadingSymbol, trailingSymbol);
//     const files: string = renderFiles(state, state.files, figures, options);
//     return promptMsg + "\n" + resolvedPathMsg + "\n" + files;
//     // return Ansi.cursorHide + promptMsg + "\n" + resolvedPathMsg + "\n" + files;
// });

// const renderFileSubmission: {
//     (state: Internal.FileState,
//         value: string,
//         options: FileOptionsReq
//     ): Effect.Effect<string, never, never>;
// } = Effect.fnUntraced(function*(state: Internal.FileState, value: string, options: FileOptionsReq)
// {
//     const figures: Figures = yield* PlatformFigures;
//     const leadingSymbol: string = figures.tick;// = Ansi.annotate(figures.tick, Ansi.green);
//     const trailingSymbol: string = figures.ellipsis;// = Ansi.annotate(figures.ellipsis, Ansi.blackBright);
//     const promptMsg: string =
//         renderPrompt(renderFileFilter(state), options.message, leadingSymbol, trailingSymbol);
//     return promptMsg + " " + value + "\n";
//     // return promptMsg + " " + Ansi.annotate(value, Ansi.white) + "\n";
// });

// const handleFileRender = (options: FileOptionsReq) =>
// {
//     return (
//         state: Internal.FileState,
//         action: Action<Internal.FileState, string>
//     ): Effect.Effect<string, never, Path.Path | FileSystem.FileSystem> =>
//     {
//         return Action.$match(action, {
//             NextFrame: ({ State: state }: { State: Internal.FileState; }) =>
//                 renderFileNextFrame(state, options),
//             NoOp: () => Effect.succeed(renderNoOp),
//             Submit: ({ value: value }: { value: string; }) => renderFileSubmission(state, value, options)
//         });
//     };
// };

// const processFileCursorUp = (state: Internal.FileState) =>
// {
//     if (state.files.length === 0)
//     {
//         return Effect.succeed(Action.NoOp());
//     }
//     const cursor: number = state.cursor - 1;
//     return Effect.succeed(Action.NextFrame({
//         State:
//         {
//             ...state,
//             cursor: cursor < 0 ? state.files.length - 1 : cursor
//         }
//     }));
// };

// const processFileCursorDown = (state: Internal.FileState) =>
// {
//     if (state.files.length === 0)
//     {
//         return Effect.succeed(Action.NoOp());
//     }

//     return Effect.succeed(Action.NextFrame({
//         State:
//         {
//             ...state,
//             cursor: (state.cursor + 1) % state.files.length
//         }
//     }));
// };

// const processFileBackspace = (state: Internal.FileState) =>
// {
//     if (state.query.length === 0)
//     {
//         return Effect.succeed(Action.NoOp());
//     }
//     const query: string = state.query.slice(0, state.query.length - 1);
//     return Effect.succeed(Action.NextFrame({ State: updateFileState(state, query) }));
// };

// const processFileClear = (state: Internal.FileState) =>
// {
//     return Effect.succeed(Action.NextFrame({ State: updateFileState(state, "") }));
// };

// const processFileInput = (input: Option.Option<string>, state: Internal.FileState) =>
// {
//     if (input.length === 0)
//     {
//         return Effect.succeed(Action.NoOp());
//     }
//     const query: string = state.query + input;
//     return Effect.succeed(Action.NextFrame({ State: updateFileState(state, query) }));
// };

// const processSelection: {
//     (state: Internal.FileState,
//         options: Internal.FileOptionsInternal
//     ): Effect.Effect<Action<Internal.FileState, string>, never, Environment>;
// } = Effect.fnUntraced(function*(state: Internal.FileState, options: Internal.FileOptionsInternal)
// {
//     if (state.files.length === 0)
//     {
//         return Action.NoOp();
//     }

//     const fs: FileSystem.FileSystem = yield* FileSystem.FileSystem;
//     const path: Path.Path = yield* Path.Path;
//     const currentPath: string = yield* resolveCurrentPath(state.path, options);
//     const selectedPath: string = state.files[state.cursor];
//     const resolvedPath: string = path.resolve(currentPath, selectedPath);
//     const info: FileSystem.File.Info = yield* Effect.orDie(fs.stat(resolvedPath));
//     if (info.type === "Directory")
//     {
//         const files: Array<string> = yield* getFileList(resolvedPath, options);
//         const filesWithoutParent: Array<string> = files.filter((file: string) => file !== "..");
//         // If the user selected a directory AND the prompt type can result with
//         // a directory, we must confirm:
//         //  - If the selected directory has any files
//         //  - Confirm whether or not the user wants to traverse those files
//         if (options.type === "directory" || options.type === "either")
//         {
//             return filesWithoutParent.length === 0
//             // Directory is empty so it's safe to select it
//                 ? Action.Submit({ value: resolvedPath })
//             // Directory has contents - show confirmation to user
//                 : Action.NextFrame({
//                     State:
//                     {
//                         ...state,
//                         confirm: Internal.Confirm.Show()
//                     }
//                 });
//         }

//         return Action.NextFrame({
//             State:
//             {

//                 allFiles: files,
//                 confirm: Internal.Confirm.Hide(),
//                 cursor: 0,
//                 files,
//                 path: Option.some(resolvedPath),
//                 query: ""
//             }
//         });
//     }

//     return Action.Submit({ value: resolvedPath });
// });

// const renderMultiSelectError = (
//     state: Internal.MultiSelectState,
//     pointer: string,
//     renderOptions?: RenderOptions | undefined
// ): string =>
// {
//     if (Option.isSome(state.error))
//     {
//         return Arr.match(state.error.value.split(NEWLINE_REGEXP), {
//             onEmpty: () => "",
//             onNonEmpty: (errorLines: readonly [ string, ...ReadonlyArray<string> ]) =>
//             {
//                 if (renderOptions?.plain === true)
//                 {
//                     return `${pointer} ${errorLines.join("\n")}`;
//                 }
//                 const prefix: string = pointer;
//                 // const prefix = Ansi.annotate(pointer, Ansi.red) + " ";
//                 // const lines = Arr.map(errorLines, (str) => annotateErrorLine(str));
//                 return "\n" + prefix + errorLines.join("\n");
//                 // return Ansi.cursorSavePosition + "\n" + prefix +
//                 //     lines.join("\n") + Ansi.cursorRestorePosition;
//             }
//         });
//     }
//     return "";
// };

// const renderChoiceDescription = <A>(
//     choice: SelectChoice<A>,
//     isActive: boolean,
//     _renderOptions?: RenderOptions | undefined
// ) =>
// {
//     if (!choice.disabled && choice.description && isActive)
//     {
//         return "- " + choice.description;
//         // return renderOptions?.plain === true
//         //     ? "- " + choice.description
//         //     : Ansi.annotate("- " + choice.description, Ansi.blackBright);
//     }
//     return "";
// };

// const metaOptionsCount: number = 2;

// const renderMultiSelectTitle = (
//     title: string,
//     _isHighlighted: boolean,
//     _renderOptions?: RenderOptions | undefined
// ) =>
// {
//     return title;
//     // if (renderOptions?.plain === true || !isHighlighted)
//     // {
//     //     return title;
//     // }

//     // return Ansi.annotate(title, Ansi.combine(Ansi.underlined, Ansi.cyanBright));
// };

// const renderMultiSelectChoices = <A>(
//     state: Internal.MultiSelectState,
//     options: SelectOptionsReq<A> & MultiSelectOptionsReq,
//     figures: Effect.Success<typeof PlatformFigures>,
//     renderOptions?: RenderOptions | undefined
// ) =>
// {
//     const choices: ReadonlyArray<SelectChoice<A>> = options.choices;
//     const totalChoices: number = choices.length;
//     const selectedCount: number = state.selectedIndices.size;
//     const allSelected: boolean = selectedCount === totalChoices;

//     const selectAllText: string = allSelected
//         ? options?.selectNone ?? "Select None"
//         : options?.selectAll ?? "Select All";

//     const inverseSelectionText: string = options?.inverseSelection ?? "Inverse Selection";

//     const metaOptions: Array<{ title: string; }> =
//         [
//             { title: selectAllText },
//             { title: inverseSelectionText }
//         ];

//     const allChoices: Array<SelectChoice<A> | { title: string; }> = [ ...metaOptions, ...choices ];
//     const toDisplay: { endIndex: number; startIndex: number; } =
//         entriesToDisplay(state.index, allChoices.length, options.maxPerPage);
//     const documents: Array<string> = [ ];
//     for (let index: number = toDisplay.startIndex; index < toDisplay.endIndex; index++)
//     {
//         const choice: SelectChoice<A> | { title: string; } = allChoices[index];
//         const isHighlighted: boolean = state.index === index;
//         let prefix: string = " ";
//         if (index === toDisplay.startIndex && toDisplay.startIndex > 0)
//         {
//             prefix = figures.arrowUp;
//         }
//         else if (index === toDisplay.endIndex - 1 && toDisplay.endIndex < allChoices.length)
//         {
//             prefix = figures.arrowDown;
//         }
//         if (index < metaOptions.length)
//         {
//             // Meta options
//             const title: string = renderMultiSelectTitle(choice.title, isHighlighted, renderOptions);
//             documents.push(prefix + " " + title);
//         }
//         else
//         {
//             // Regular choices
//             const choiceIndex: number = index - metaOptions.length;
//             const isSelected: boolean = state.selectedIndices.has(choiceIndex);
//             const checkbox: string = isSelected ? figures.checkboxOn : figures.checkboxOff;
//             const annotatedCheckbox: string = checkbox;
//             // const annotatedCheckbox = isHighlighted && renderOptions?.plain !== true
//             //     ? Ansi.annotate(checkbox, Ansi.cyanBright)
//             //     : checkbox;
//             const title: string = renderMultiSelectTitle(choice.title, isHighlighted, renderOptions);
//             const description: string = renderChoiceDescription(
//                 choice as SelectChoice<A>,
//                 isHighlighted,
//                 renderOptions
//             );
//             documents.push(prefix + " " + annotatedCheckbox + " " + title + " " + description);
//         }
//     }
//     return documents.join("\n");
// };

// const renderMultiSelectNextFrame: {
//     <A>(state: Internal.MultiSelectState,
//         options: SelectOptionsReq<A>): Effect.Effect<string, never, never>;
// } = Effect.fnUntraced(
//     function*<A>(state: Internal.MultiSelectState, options: SelectOptionsReq<A>)
//     {
//         const figures: Figures = yield* PlatformFigures;
//         const choices: string = renderMultiSelectChoices(state, options, figures);
//         const leadingSymbol: string = "?";// = Ansi.annotate("?", Ansi.cyanBright);
//         const trailingSymbol: string = figures.pointerSmall;
//         //     = Ansi.annotate(figures.pointerSmall, Ansi.blackBright);
//         const promptMsg: string = renderSelectOutput(leadingSymbol, trailingSymbol, options);
//         const error: string = renderMultiSelectError(state, figures.pointer);
//         return promptMsg + "\n" + choices + error;
//         // return Ansi.cursorHide + promptMsg + "\n" + choices + error;
//     }
// );

// const renderMultiSelectSubmission: {
//     <A>(state: Internal.MultiSelectState,
//            options: SelectOptionsReq<A>): Effect.Effect<string, never, never>;
// } = Effect.fnUntraced(
//     function*<A>(state: Internal.MultiSelectState, options: SelectOptionsReq<A>)
//     {
//         const figures: Figures = yield* PlatformFigures;
//         const selectedChoices: Array<string> =
//             Array.from(state.selectedIndices).sort(EffectNumber.Order).map((index: number) =>
//                 options.choices[index].title
//             );
//         const selectedText: string = selectedChoices.join(", ");
//         const leadingSymbol: string = figures.tick;
//         const trailingSymbol: string = figures.ellipsis;
//         // const leadingSymbol: string = Ansi.annotate(figures.tick, Ansi.green);
//         // const trailingSymbol: string = Ansi.annotate(figures.ellipsis, Ansi.blackBright);
//         const promptMsg: string = renderSelectOutput(leadingSymbol, trailingSymbol, options);
//         return promptMsg + " " + selectedText;
//         // return promptMsg + " " + Ansi.annotate(selectedText, Ansi.white) + "\n";
//     }
// );

// const processMultiSelectCursorUp = (state: Internal.MultiSelectState, totalChoices: number) =>
// {
//     const newIndex: number = state.index === 0 ? totalChoices - 1 : state.index - 1;
//     return Effect.succeed(Action.NextFrame({ State: { ...state, index: newIndex } }));
// };

// const processMultiSelectCursorDown = (state: Internal.MultiSelectState, totalChoices: number) =>
// {
//     const newIndex: number = (state.index + 1) % totalChoices;
//     return Effect.succeed(Action.NextFrame({ State: { ...state, index: newIndex } }));
// };

// const processSpace = <A>(
//     state: Internal.MultiSelectState,
//     options: SelectOptionsReq<A>
// ) =>
// {
//     const selectedIndices: Set<number> = new Set(state.selectedIndices);
//     if (state.index === 0)
//     {
//         if (state.selectedIndices.size === options.choices.length)
//         {
//             selectedIndices.clear();
//         }
//         else
//         {
//             for (let i: number = 0; i < options.choices.length; i++)
//             {
//                 selectedIndices.add(i);
//             }
//         }
//     }
//     else if (state.index === 1)
//     {
//         for (let i: number = 0; i < options.choices.length; i++)
//         {
//             if (state.selectedIndices.has(i))
//             {
//                 selectedIndices.delete(i);
//             }
//             else
//             {
//                 selectedIndices.add(i);
//             }
//         }
//     }
//     else
//     {
//         const choiceIndex: number = state.index - metaOptionsCount;
//         if (selectedIndices.has(choiceIndex))
//         {
//             selectedIndices.delete(choiceIndex);
//         }
//         else
//         {
//             selectedIndices.add(choiceIndex);
//         }
//     }
//     return Effect.succeed(Action.NextFrame({ State: { ...state, selectedIndices } }));
// };

// const handleMultiSelectClear = <A>(options: SelectOptionsReq<A>) =>
//     Effect.fnUntraced(function*(
//         state: Internal.MultiSelectState,
//         _: Action<Internal.MultiSelectState, Array<A>>
//     )
//     {
//         const terminal: Terminal.Terminal = yield* Terminal.Terminal;
//         const columns: number = yield* terminal.columns;
//         const figures: Figures = yield* PlatformFigures;
//         // const clearPrompt = Ansi.eraseLine + Ansi.cursorLeft;
//         const promptText: string = renderSelectOutput("?", figures.pointerSmall, options, { plain: true });
//         const choicesText: string = renderMultiSelectChoices(state, options, figures, { plain: true });
//         const errorText: string = renderMultiSelectError(state, figures.pointer, { plain: true });
//         const clearOutput: string =
//             clearOutputWithError(`${ promptText }\n${ choicesText }`, columns, errorText);
//         return clearOutput; // + clearPrompt;
//     });

// const handleMultiSelectRender = <A>(options: SelectOptionsReq<A>) =>
// {
//     return (state: Internal.MultiSelectState, action: Action<Internal.MultiSelectState, Array<A>>) =>
//     {
//         return Action.$match(action, {
//             NextFrame: ({ State: state }: { State: Internal.MultiSelectState; }) =>
//                 renderMultiSelectNextFrame(state, options),
//             NoOp: () => Effect.succeed(renderNoOp),
//             Submit: () => renderMultiSelectSubmission(state, options)
//         });
//     };
// };

// const handleNumberClear = (options: IntegerOptionsReq) =>
// {
//     return Effect.fnUntraced(function*(
//         state: Internal.NumberState,
//         _: Action<Internal.NumberState, number>
//     )
//     {
//         const terminal: Terminal.Terminal = yield* Terminal.Terminal;
//         const columns: number = yield* terminal.columns;
//         const figures: Figures = yield* PlatformFigures;
//         const resetCurrentLine: string = "";// = Ansi.eraseLine + Ansi.cursorLeft;
//         const errorText: string = renderNumberError(state, figures.pointerSmall, { plain: true });
//         const promptText: string =
//             renderNumberOutput(state, "?", figures.pointerSmall, options, { plain: true });
//         const clearOutput: string = clearOutputWithError(promptText, columns, errorText);
//         return clearOutput + resetCurrentLine;
//     });
// };

// const renderNumberInput = (
//     state: Internal.NumberState,
//     submitted: boolean,
//     renderOptions?: RenderOptions | undefined
// ): string =>
// {
//     const value: string = state.value === "" ? "" : `${ state.value }`;
//     if (submitted || renderOptions?.plain === true)
//     {
//         return value;
//     }

//     return value;

//     // const annotation = Option.isSome(state.error)
//     //     ? Ansi.red
//     //     : Ansi.combine(Ansi.underlined, Ansi.cyanBright);
//     // return Ansi.annotate(value, annotation);
// };

// const renderNumberError = (
//     state: Internal.NumberState,
//     pointer: string,
//     _renderOptions?: RenderOptions | undefined
// ) =>
// {
//     if (Option.isSome(state.error))
//     {
//         return Arr.match(state.error.value.split(NEWLINE_REGEXP), {
//             onEmpty: () => "",
//             onNonEmpty: (errorLines: Arr.NonEmptyReadonlyArray<string>) =>
//             {
//                 return `${ pointer } ${ errorLines.join("\n") }`;
//                 // if (renderOptions?.plain === true)
//                 // {
//                 //     return `${pointer} ${errorLines.join("\n")}`;
//                 // }
//                 // const prefix: string = pointer;// = Ansi.annotate(pointer, Ansi.red) + " ";
//                 // const lines = Arr.map(errorLines, (str: string) => annotateErrorLine(str));
//                 // return Ansi.cursorSavePosition + "\n" +
//                 //     prefix + lines.join("\n") + Ansi.cursorRestorePosition;
//             }
//         });
//     }
//     return "";
// };

// const renderNumberOutput = (
//     state: Internal.NumberState,
//     leadingSymbol: string,
//     trailingSymbol: string,
//     options: IntegerOptionsReq,
//     renderOptions?: RenderOptions | undefined,
//     submitted: boolean = false
// ) =>
// {
//     const value: string = renderNumberInput(state, submitted, renderOptions);
//     return renderPrompt(value, options.message, leadingSymbol, trailingSymbol, renderOptions);
// };

// const renderNumberNextFrame: {
//     (state: Internal.NumberState, options: IntegerOptionsReq): Effect.Effect<string, never, never>;
// } = Effect.fnUntraced(function*(state: Internal.NumberState, options: IntegerOptionsReq)
// {
//     const figures: Figures = yield* PlatformFigures;
//     const leadingSymbol: string = "?";//= Ansi.annotate("?", Ansi.cyanBright);
//     const trailingSymbol: string = figures.pointerSmall;
//     //     = Ansi.annotate(figures.pointerSmall, Ansi.blackBright);
//     const errorMsg: string = renderNumberError(state, figures.pointerSmall);
//     const promptMsg: string = renderNumberOutput(state, leadingSymbol, trailingSymbol, options);
//     return promptMsg + errorMsg;
// });

// const renderNumberSubmission: {
//     (nextState: Internal.NumberState, options: IntegerOptionsReq): Effect.Effect<string, never, never>;
// } = Effect.fnUntraced(function*(nextState: Internal.NumberState, options: IntegerOptionsReq)
// {
//     const figures: Figures = yield* PlatformFigures;
//     const leadingSymbol: string = figures.tick;// = Ansi.annotate(figures.tick, Ansi.green);
//     const trailingSymbol: string = figures.ellipsis;// = Ansi.annotate(figures.ellipsis, Ansi.blackBright);
//     const promptMsg: string =
//         renderNumberOutput(nextState, leadingSymbol, trailingSymbol, options, undefined, true);
//     return promptMsg + "\n";
// });

// const processNumberBackspace = (state: Internal.NumberState) =>
// {
//     if (state.value.length <= 0)
//     {
//         return Effect.succeed(Action.NoOp());
//     }
//     const value: string = state.value.slice(0, state.value.length - 1);
//     return Effect.succeed(Action.NextFrame({
//         State:
//         {
//             ...state,
//             error: Option.none(),
//             value
//         }
//     }));
// };

// const processNumberClear = (state: Internal.NumberState) =>
//     Effect.succeed(Action.NextFrame({
//         State:
//         {
//             ...state,
//             cursor: 0,
//             error: Option.none(),
//             value: ""
//         }
//     }));

// const defaultIntProcessor = (input: Option.Option<string>, state: Internal.NumberState) =>
// {
//     if (state.value.length === 0 && input === "-")
//     {
//         return Effect.succeed(Action.NextFrame({
//             State:
//             {
//                 ...state,
//                 error: Option.none(),
//                 value: "-"
//             }
//         }));
//     }

//     const parsed: number = Number.parseInt(state.value + input);
//     if (Number.isNaN(parsed))
//     {
//         return Effect.succeed(Action.NoOp());
//     }
//     else
//     {
//         return Effect.succeed(Action.NextFrame({
//             State:
//             {
//                 ...state,
//                 error: Option.none(),
//                 value: `${ parsed }`
//             }
//         }));
//     }
// };

// const defaultFloatProcessor = (input: Option.Option<string>, state: Internal.NumberState) =>
// {
//     if (input === "." && state.value.includes("."))
//     {
//         return Effect.succeed(Action.NoOp());
//     }
//     if (state.value.length === 0 && input === "-")
//     {
//         return Effect.succeed(Action.NextFrame({
//             State:
// {

//     ...state,
//     error: Option.none(),
//     value: "-"
// }
//         }));
//     }

//     const parsed: number = Number.parseFloat(state.value + input);
//     if (Number.isNaN(parsed))
//     {
//         return Effect.succeed(Action.NoOp());
//     }
//     else
//     {
//         return Effect.succeed(Action.NextFrame({
//             State:
//             {
//                 ...state,
//                 error: Option.none(),
//                 value: Option.isSome(input) && input.value === "." ? `${ parsed }.` : `${ parsed }`
//             }
//         }));
//     }
// };

// const handleRenderInteger = (options: IntegerOptionsReq) =>
// {
//     return (state: Internal.NumberState, action: Action<Internal.NumberState, number>) =>
//     {
//         return Action.$match(action, {
//             NextFrame: ({ State: state }: { State: Internal.NumberState; }) =>
//                 renderNumberNextFrame(state, options),
//             NoOp: () => Effect.succeed(renderNoOp),
//             Submit: () => renderNumberSubmission(state, options)
//         });
//     };
// };

// const handleRenderFloat = (options: FloatOptionsReq) =>
// {
//     return (state: Internal.NumberState, action: Action<Internal.NumberState, number>) =>
//     {
//         return Action.$match(action, {
//             NextFrame: ({ State: state }: { State: Internal.NumberState; }) =>
//                 renderNumberNextFrame(state, options),
//             NoOp: () => Effect.succeed(renderNoOp),
//             Submit: () => renderNumberSubmission(state, options)
//         });
//     };
// };

// const updateAutoCompleteState = <A>(
//     state: Internal.AutoCompleteState,
//     options: AutoCompleteOptionsReq<A>,
//     query: string
// ): Internal.AutoCompleteState =>
// {
//     const filtered: Array<number> = filterAutoCompleteChoices(options.choices, query);
//     if (filtered.length === 0)
//     {
//         return {
//             ...state,
//             filtered,
//             index: 0,
//             query
//         };
//     }
//     if (filtered.includes(state.index))
//     {
//         return {
//             ...state,
//             filtered,
//             query
//         };
//     }

//     return {
//         ...state,
//         filtered,
//         index: filtered[0],
//         query
//     };
// };

// const autoCompleteCursor = (state: Internal.AutoCompleteState) =>
//     Option.getOrElse(
//         Arr.findFirstIndex(state.filtered, (index: number) => index === state.index),
//         () => 0
//     );

// const renderSelectOutput = <A>(
//     leadingSymbol: string,
//     trailingSymbol: string,
//     options: SelectOptionsReq<A>,
//     renderOptions?: RenderOptions | undefined
// ) => renderPrompt("", options.message, leadingSymbol, trailingSymbol, renderOptions);

// const renderAutoCompleteFilter = <A>(
//     state: Internal.AutoCompleteState,
//     options: AutoCompleteOptionsReq<A>,
//     _renderOptions?: RenderOptions | undefined
// ) =>
// {
//     const filterValue: string = state.query.length === 0
//         ? options.filterPlaceholder
//         : state.query;
//     //     ? renderOptions?.plain === true
//     //         ? options.filterPlaceholder
//     //         : Ansi.annotate(options.filterPlaceholder, Ansi.blackBright)
//     //     : renderOptions?.plain === true
//     //         ? state.query
//     //         : Ansi.annotate(state.query, Ansi.combine(Ansi.underlined, Ansi.cyanBright));
//     return `[${ options.filterLabel }: ${ filterValue }]`;
// };

// const renderAutoCompleteOutput = <A>(
//     state: Internal.AutoCompleteState,
//     leadingSymbol: string,
//     trailingSymbol: string,
//     options: AutoCompleteOptionsReq<A>,
//     renderOptions?: RenderOptions | undefined
// ) =>
// {
//     const filter: string = renderAutoCompleteFilter(state, options, renderOptions);
//     return renderPrompt(filter, options.message, leadingSymbol, trailingSymbol, renderOptions);
// };

// const renderChoicePrefix = <A>(
//     state: Internal.SelectState,
//     choices: SelectOptionsReq<A>["choices"],
//     toDisplay: { readonly startIndex: number; readonly endIndex: number },
//     currentIndex: number,
//     figures: Effect.Success<typeof PlatformFigures>,
//     renderOptions?: RenderOptions | undefined
// ) =>
// {
//     let prefix: string = " ";
//     if (currentIndex === toDisplay.startIndex && toDisplay.startIndex > 0)
//     {
//         prefix = figures.arrowUp;
//     }
//     else if (currentIndex === toDisplay.endIndex - 1 && toDisplay.endIndex < choices.length)
//     {
//         prefix = figures.arrowDown;
//     }
//     if (renderOptions?.plain === true)
//     {
//         return state === currentIndex
//             ? figures.pointer + prefix
//             : prefix + " ";
//     }
//     if (choices[currentIndex].disabled)
//     {
//         // const annotation: string = Ansi.combine(Ansi.bold, Ansi.blackBright);
//         return state === currentIndex
//             ? figures.pointer + prefix
//             // ? Ansi.annotate(figures.pointer, annotation) + prefix
//             : prefix + " ";
//     }
//     return state === currentIndex
//         ? figures.pointer + prefix
//         // ? Ansi.annotate(figures.pointer, Ansi.cyanBright) + prefix
//         : prefix + " ";
// };

// const renderAutoCompleteChoicePrefix = <A>(
//     state: Internal.AutoCompleteState,
//     options: AutoCompleteOptionsReq<A>,
//     toDisplay: { readonly startIndex: number; readonly endIndex: number },
//     currentIndex: number,
//     figures: Effect.Success<typeof PlatformFigures>,
//     renderOptions?: RenderOptions | undefined
// ) =>
// {
//     let prefix: string = " ";
//     if (currentIndex === toDisplay.startIndex && toDisplay.startIndex > 0)
//     {
//         prefix = figures.arrowUp;
//     }
//     else if (currentIndex === toDisplay.endIndex - 1 && toDisplay.endIndex < state.filtered.length)
//     {
//         prefix = figures.arrowDown;
//     }
//     const choiceIndex: number = state.filtered[currentIndex];
//     if (renderOptions?.plain === true)
//     {
//         return state.index === choiceIndex
//             ? figures.pointer + prefix
//             : prefix + " ";
//     }
//     const choice: SelectChoice<A> = options.choices[choiceIndex];
//     if (choice.disabled)
//     {
//         // const annotation = Ansi.combine(Ansi.bold, Ansi.blackBright);
//         return state.index === choiceIndex
//             ? figures.pointer + prefix
//             // ? Ansi.annotate(figures.pointer, annotation) + prefix
//             : prefix + " ";
//     }
//     return state.index === choiceIndex
//         ? figures.pointer + prefix
//         // ? Ansi.annotate(figures.pointer, Ansi.cyanBright) + prefix
//         : prefix + " ";
// };

// const renderChoiceTitle = <A>(
//     choice: SelectChoice<A>,
//     _isSelected: boolean,
//     renderOptions?: RenderOptions | undefined
// ) =>
// {
//     if (renderOptions?.plain === true)
//     {
//         return choice.title;
//     }
//     const title: string = choice.title;
//     return title;
//     // if (isSelected)
//     // {
//     //     return choice.disabled
//     //         ? Ansi.annotate(title, Ansi.combine(Ansi.underlined, Ansi.blackBright))
//     //         : Ansi.annotate(title, Ansi.combine(Ansi.underlined, Ansi.cyanBright));
//     // }
//     // return choice.disabled
//     //     ? Ansi.annotate(title, Ansi.combine(Ansi.strikethrough, Ansi.blackBright))
//     //     : title;
// };

// const renderSelectChoices = <A>(
//     state: Internal.SelectState,
//     options: SelectOptionsReq<A>,
//     figures: Effect.Success<typeof PlatformFigures>,
//     renderOptions?: RenderOptions | undefined
// ) =>
// {
//     const choices: ReadonlyArray<SelectChoice<A>> = options.choices;
//     const toDisplay: { endIndex: number; startIndex: number; } =
//         entriesToDisplay(state, choices.length, options.maxPerPage);
//     const documents: Array<string> = [ ];
//     for (let index: number = toDisplay.startIndex; index < toDisplay.endIndex; index++)
//     {
//         const choice: SelectChoice<A> = choices[index];
//         const isSelected: boolean = state === index;
//         const prefix: string =
//             renderChoicePrefix(state, choices, toDisplay, index, figures, renderOptions);
//         const title: string = renderChoiceTitle(choice, isSelected, renderOptions);
//         const description: string = renderChoiceDescription(choice, isSelected, renderOptions);
//         documents.push(prefix + title + " " + description);
//     }
//     return documents.join("\n");
// };

// const renderAutoCompleteChoices = <A>(
//     state: Internal.AutoCompleteState,
//     options: AutoCompleteOptionsReq<A>,
//     figures: Effect.Success<typeof PlatformFigures>,
//     renderOptions?: RenderOptions | undefined
// ) =>
// {
//     if (state.filtered.length === 0)
//     {
//         return options.emptyMessage;
//         // return renderOptions?.plain === true
//         //     ? options.emptyMessage
//         //     : Ansi.annotate(options.emptyMessage, Ansi.blackBright);
//     }
//     const cursor: number = autoCompleteCursor(state);
//     const toDisplay: { endIndex: number; startIndex: number; } =
//         entriesToDisplay(cursor, state.filtered.length, options.maxPerPage);
//     const documents: Array<string> = [ ];
//     for (let index: number = toDisplay.startIndex; index < toDisplay.endIndex; index++)
//     {
//         const choiceIndex: number = state.filtered[index];
//         const choice: SelectChoice<A> = options.choices[choiceIndex];
//         const isSelected: boolean = state.index === choiceIndex;
//         const prefix: string =
//             renderAutoCompleteChoicePrefix(state, options, toDisplay, index, figures, renderOptions);
//         const title: string = renderChoiceTitle(choice, isSelected, renderOptions);
//         const description: string = renderChoiceDescription(choice, isSelected, renderOptions);
//         documents.push(prefix + title + " " + description);
//     }
//     return documents.join("\n");
// };

// const renderSelectNextFrame: {
//     <A>(state: number, options: SelectOptionsReq<A>): Effect.Effect<string, never, never>;
// } = Effect.fnUntraced(function*<A>(state: Internal.SelectState, options: SelectOptionsReq<A>)
// {
//     const figures: Figures = yield* PlatformFigures;
//     const choices: string = renderSelectChoices(state, options, figures);
//     const leadingSymbol: string = "?";// = Ansi.annotate("?", Ansi.cyanBright);
//     const trailingSymbol: string = figures.pointerSmall;
//     //     = Ansi.annotate(figures.pointerSmall, Ansi.blackBright);
//     const promptMsg: string = renderSelectOutput(leadingSymbol, trailingSymbol, options);
//     return promptMsg + "\n" + choices;
//     // return Ansi.cursorHide + promptMsg + "\n" + choices;
// });

// const renderAutoCompleteNextFrame: {
//     <A>(
//         state: Internal.AutoCompleteState,
//         options: AutoCompleteOptionsReq<A>
//     ): Effect.Effect<string, never, never>;
// } = Effect.fnUntraced(function*<A>(
//     state: Internal.AutoCompleteState,
//     options: AutoCompleteOptionsReq<A>
// )
// {
//     const figures: Figures = yield* PlatformFigures;
//     const choices: string = renderAutoCompleteChoices(state, options, figures);
//     const leadingSymbol: string = "?";// = Ansi.annotate("?", Ansi.cyanBright);
//     const trailingSymbol: string = figures.pointerSmall;
//     //     = Ansi.annotate(figures.pointerSmall, Ansi.blackBright);
//     const promptMsg: string = renderAutoCompleteOutput(state, leadingSymbol, trailingSymbol, options);
//     return promptMsg + "\n" + choices;
//     // return Ansi.cursorHide + promptMsg + "\n" + choices;
// });

// const renderSelectSubmission: {
//     <A>(state: number, options: SelectOptionsReq<A>): Effect.Effect<string, never, never>;
// } = Effect.fnUntraced(function*<A>(state: Internal.SelectState, options: SelectOptionsReq<A>)
// {
//     const figures: Figures = yield* PlatformFigures;
//     const selected: string = options.choices[state].title;
//     const leadingSymbol: string = figures.tick;// = Ansi.annotate(figures.tick, Ansi.green);
//     const trailingSymbol: string = figures.ellipsis;// = Ansi.annotate(figures.ellipsis, Ansi.blackBright);
//     const promptMsg: string = renderSelectOutput(leadingSymbol, trailingSymbol, options);
//     return promptMsg + " " + selected + "\n";
//     // return promptMsg + " " + Ansi.annotate(selected, Ansi.white) + "\n";
// });

// const renderAutoCompleteSubmission: {
//     <A>(
//         state: Internal.AutoCompleteState,
//         options: AutoCompleteOptionsReq<A>
//     ): Effect.Effect<string, never, never>;
// } = Effect.fnUntraced(function*<A>(
//     state: Internal.AutoCompleteState,
//     options: AutoCompleteOptionsReq<A>
// )
// {
//     const figures: Figures = yield* PlatformFigures;
//     const selected: string = options.choices[state.index].title;
//     const leadingSymbol: string = figures.tick;// = Ansi.annotate(figures.tick, Ansi.green);
//     const trailingSymbol: string = figures.ellipsis;// = Ansi.annotate(figures.ellipsis, Ansi.blackBright);
//     const promptMsg: string = renderAutoCompleteOutput(state, leadingSymbol, trailingSymbol, options);
//     return promptMsg + " " + selected + "\n";
//     // return promptMsg + " " + Ansi.annotate(selected, Ansi.white) + "\n";
// });

// const processSelectCursorUp = <A>(state: Internal.SelectState, choices: SelectOptionsReq<A>["choices"]) =>
// {
//     if (state === 0)
//     {
//         return Effect.succeed(Action.NextFrame({ State: choices.length - 1 }));
//     }
//     return Effect.succeed(Action.NextFrame({ State: state - 1 }));
// };

// const processSelectCursorDown = <A>(
//     state: Internal.SelectState, choices: SelectOptionsReq<A>["choices"]
// ) =>
// {
//     if (state === choices.length - 1)
//     {
//         return Effect.succeed(Action.NextFrame({ State: 0 }));
//     }
//     return Effect.succeed(Action.NextFrame({ State: state + 1 }));
// };

// const processSelectNext = <A>(state: Internal.SelectState, choices: SelectOptionsReq<A>["choices"]) =>
// {
//     return Effect.succeed(Action.NextFrame({ State: (state + 1) % choices.length }));
// };

// const processAutoCompleteCursorUp = (state: Internal.AutoCompleteState) =>
// {
//     if (state.filtered.length === 0)
//     {
//         return Effect.succeed(Action.NoOp());
//     }
//     const cursor: number = autoCompleteCursor(state);
//     const nextCursor: number = cursor === 0 ? state.filtered.length - 1 : cursor - 1;
//     return Effect.succeed(Action.NextFrame({ State: { ...state, index: state.filtered[nextCursor] } }));
// };

// const processAutoCompleteCursorDown = (state: Internal.AutoCompleteState) =>
// {
//     if (state.filtered.length === 0)
//     {
//         return Effect.succeed(Action.NoOp());
//     }
//     const cursor: number = autoCompleteCursor(state);
//     const nextCursor: number = (cursor + 1) % state.filtered.length;
//     return Effect.succeed(Action.NextFrame({ State: { ...state, index: state.filtered[nextCursor] } }));
// };

// const processAutoCompleteNext = (state: Internal.AutoCompleteState) =>
//     processAutoCompleteCursorDown(state);

// const processAutoCompleteBackspace = <A>(
//     state: Internal.AutoCompleteState,
//     options: AutoCompleteOptionsReq<A>
// ) =>
// {
//     if (state.query.length === 0)
//     {
//         return Effect.succeed(Action.NoOp());
//     }
//     const query: string = state.query.slice(0, state.query.length - 1);
//     return Effect.succeed(Action.NextFrame({ State: updateAutoCompleteState(state, options, query) }));
// };

// const processAutoCompleteClear = <A>(
//     state: Internal.AutoCompleteState,
//     options: AutoCompleteOptionsReq<A>
// ) => Effect.succeed(Action.NextFrame({ State: updateAutoCompleteState(state, options, "") }));

// const processAutoCompleteInput: {
//     <A>(
//         input: Option.Option<string>,
//         state: Internal.AutoCompleteState,
//         options: AutoCompleteOptionsReq<A>
//     ): Effect.Effect<Action<Internal.AutoCompleteState, A>>;
// } = <A>(
//     input: Option.Option<string>,
//     state: Internal.AutoCompleteState,
//     options: AutoCompleteOptionsReq<A>
// ) =>
// {
//     if (Option.isSome(input) && input.value.length === 0)
//     {
//         return Effect.succeed(Action.NoOp());
//     }
//     const query: string = state.query + (input.valueOrUndefined ?? "");
//     return Effect.succeed(Action.NextFrame({ State: updateAutoCompleteState(state, options, query) }));
// };

// const handleSelectRender = <A>(options: SelectOptionsReq<A>) =>
// {
//     return (state: Internal.SelectState, action: Action<Internal.SelectState, A>) =>
//     {
//         return Action.$match(action, {
//             NextFrame: ({ State: state }: { State: Internal.SelectState; }) =>
//                 renderSelectNextFrame(state, options),
//             NoOp: () => Effect.succeed(renderNoOp),
//             Submit: () => renderSelectSubmission(state, options)
//         });
//     };
// };

// const handleAutoCompleteRender = <A>(options: AutoCompleteOptionsReq<A>) =>
// {
//     return (state: Internal.AutoCompleteState, action: Action<Internal.AutoCompleteState, A>) =>
//     {
//         return Action.$match(action, {
//             NextFrame: ({ State: state }: { State: Internal.AutoCompleteState; }) =>
//                 renderAutoCompleteNextFrame(state, options),
//             NoOp: () => Effect.succeed(renderNoOp),
//             Submit: () => renderAutoCompleteSubmission(state, options)
//         });
//     };
// };

// const handleSelectClear = <A>(options: SelectOptionsReq<A>) =>
//     Effect.fnUntraced(function*(state: Internal.SelectState, _: Action<Internal.SelectState, A>)
//     {
//         const terminal: Terminal.Terminal = yield* Terminal.Terminal;
//         const columns: number = yield* terminal.columns;
//         const figures: Figures = yield* PlatformFigures;
//         const clearPrompt: string = "";// = Ansi.eraseLine + Ansi.cursorLeft;
//         const promptText: string = renderSelectOutput("?", figures.pointerSmall, options, { plain: true });
//         const choicesText: string = renderSelectChoices(state, options, figures, { plain: true });
//         const clearOutput: string = eraseText(`${ promptText }\n${ choicesText }`, columns);
//         return clearOutput + clearPrompt;
//     });

// const handleAutoCompleteClear = <A>(options: AutoCompleteOptionsReq<A>) =>
//     Effect.fnUntraced(function*(
//         state: Internal.AutoCompleteState,
//         _: Action<Internal.AutoCompleteState, A>
//     )
//     {
//         const terminal: Terminal.Terminal = yield* Terminal.Terminal;
//         const columns: number = yield* terminal.columns;
//         const figures: Figures = yield* PlatformFigures;
//         const clearPrompt: string = "";// = Ansi.eraseLine + Ansi.cursorLeft;
//         const promptText: string =
//             renderAutoCompleteOutput(state, "?", figures.pointerSmall, options, { plain: true });
//         const choicesText: string = renderAutoCompleteChoices(state, options, figures, { plain: true });
//         const clearOutput: string = eraseText(`${promptText}\n${choicesText}`, columns);
//         return clearOutput + clearPrompt;
//     });

// const renderClearScreen: {
//     (state: Internal.TextState, options: TextOptionsReq): Effect.Effect<string, never, Terminal.Terminal>;
// } = Effect.fnUntraced(function*(state: Internal.TextState, options: TextOptionsReq)
// {
//     const terminal: Terminal.Terminal = yield* Terminal.Terminal;
//     const columns: number = yield* terminal.columns;
//     const figures: Figures = yield* PlatformFigures;
//     const resetCurrentLine: string = "";// = Ansi.eraseLine + Ansi.cursorLeft;
//     const errorText: string = renderTextError(state, figures.pointerSmall, { plain: true });
//     const clearOutput: string = clearOutputWithError(
//         renderTextOutput(state, "?", figures.pointerSmall, options, { plain: true }),
//         columns,
//         errorText
//     );
//     return clearOutput + resetCurrentLine;
// });

// const renderTextInput = (
//     nextState: Internal.TextState,
//     options: TextOptionsReq,
//     _submitted: boolean,
//     renderOptions?: RenderOptions | undefined
// ) =>
// {
//     const text: string = nextState.value;
//     if (renderOptions?.plain === true)
//     {
//         switch (options.type)
//         {
//             case "hidden":
//             {
//                 return "";
//             }
//             case "password":
//             {
//                 return "*".repeat(text.length);
//             }
//             case "text":
//             {
//                 return text;
//             }
//         }
//     }

//     // const annotation = Option.isSome(nextState.error) ?
//     //     Ansi.red
//     //     : submitted ?
//     //         Ansi.white
//     //         : nextState.value.length === 0 ?
//     //             Ansi.blackBright
//     //             : Ansi.combine(Ansi.underlined, Ansi.cyanBright);

//     return text;
//     // switch (options.type)
//     // {
//     //     case "hidden":
//     //     {
//     //         return "";
//     //     }
//     //     case "password":
//     //     {
//     //         return Ansi.annotate("*".repeat(text.length), annotation);
//     //     }
//     //     case "text":
//     //     {
//     //         return Ansi.annotate(text, annotation);
//     //     }
//     // }
// };

// const renderTextError = (
//     nextState: Internal.TextState,
//     pointer: string,
//     renderOptions?: RenderOptions | undefined
// ): string =>
// {
//     if (Option.isSome(nextState.error))
//     {
//         return Arr.match(nextState.error.value.split(NEWLINE_REGEXP), {
//             onEmpty: () => "",
//             onNonEmpty: (errorLines: Arr.NonEmptyReadonlyArray<string>) =>
//             {
//                 if (renderOptions?.plain === true)
//                 {
//                     return `${pointer} ${errorLines.join("\n")}`;
//                 }
//                 const prefix: string = pointer;// = Ansi.annotate(pointer, Ansi.red) + " ";
//                 // const lines = Arr.map(errorLines, (str) => annotateErrorLine(str));
//                 return "\n" + prefix + errorLines.join("\n");
//                 // return Ansi.cursorSavePosition + "\n" + prefix +
//                 //     lines.join("\n") + Ansi.cursorRestorePosition;
//             }
//         });
//     }
//     return "";
// };

// const renderTextOutput = (
//     nextState: Internal.TextState,
//     leadingSymbol: string,
//     trailingSymbol: string,
//     options: TextOptionsReq,
//     renderOptions?: RenderOptions | undefined,
//     submitted: boolean = false
// ) =>
// {
//     const value: string = renderTextInput(nextState, options, submitted, renderOptions);
//     return renderPrompt(value, options.message, leadingSymbol, trailingSymbol, renderOptions);
// };

// const renderTextNextFrame: {
//     (state: Internal.TextState, options: TextOptionsReq): Effect.Effect<string, never, never>;
// } = Effect.fnUntraced(function*(state: Internal.TextState, options: TextOptionsReq)
// {
//     const figures: Figures = yield* PlatformFigures;
//     const leadingSymbol: string = "?";// = Ansi.annotate("?", Ansi.cyanBright);
//     const trailingSymbol: string = figures.pointerSmall;
//     //     = Ansi.annotate(figures.pointerSmall, Ansi.blackBright);
//     const promptMsg: string = renderTextOutput(state, leadingSymbol, trailingSymbol, options);
//     const errorMsg: string = renderTextError(state, figures.pointerSmall);
//     // const offset: number = state.cursor - state.value.length;
//     return promptMsg + errorMsg; // + Ansi.cursorMove(offset);
// });

// const renderTextSubmission: {
//     (state: Internal.TextState, options: TextOptionsReq): Effect.Effect<string, never, never>;
// } = Effect.fnUntraced(function*(state: Internal.TextState, options: TextOptionsReq)
// {
//     const figures: Figures = yield* PlatformFigures;
//     const leadingSymbol: string = figures.tick;// = Ansi.annotate(figures.tick, Ansi.green);
//     const trailingSymbol: string = figures.ellipsis;// = Ansi.annotate(figures.ellipsis, Ansi.blackBright);
//     const promptMsg: string =
//         renderTextOutput(state, leadingSymbol, trailingSymbol, options, undefined, true);

//     return promptMsg + "\n";
// });

// const handleTextRender = (options: TextOptionsReq) =>
// {
//     return (state: Internal.TextState, action: Action<Internal.TextState, string>) =>
//     {
//         return Action.$match(action, {
//             NextFrame: ({ State: state }: { State: Internal.TextState; }) =>
//                 renderTextNextFrame(state, options),
//             NoOp: () => Effect.succeed(renderNoOp),
//             Submit: () => renderTextSubmission(state, options)
//         });
//     };
// };

// const handleToggleClear: {
//     (options: ToggleOptionsReq): Effect.Effect<string, never, Terminal.Terminal>;
// } = Effect.fnUntraced(function*(options: ToggleOptionsReq)
// {
//     const terminal: Terminal.Terminal = yield* Terminal.Terminal;
//     const columns: number = yield* terminal.columns;
//     const figures: Figures = yield* PlatformFigures;
//     const clearPrompt: string = ""; // = Ansi.eraseLine + Ansi.cursorLeft;
//     const toggleText: string = `${ options.active } / ${ options.inactive }`;
//     const promptText: string =
//         renderPrompt(toggleText, options.message, "?", figures.pointerSmall, { plain: true });
//     const clearOutput: string = eraseText(promptText, columns);
//     return clearOutput + clearPrompt;
// });

// const renderToggle = (
//     _value: boolean,
//     options: ToggleOptionsReq,
//     _submitted: boolean = false
// ) =>
// {
//     const separator: string = "/";// = Ansi.annotate("/", Ansi.blackBright);
//     // const selectedAnnotation: string = "";
//     //     = Ansi.combine(Ansi.underlined, submitted ? Ansi.white : Ansi.cyanBright);
//     const inactive: string = options.inactive;// value
//     //     ? options.inactive
//     //     : Ansi.annotate(options.inactive, selectedAnnotation);
//     const active: string = options.active;// value
//     //     ? Ansi.annotate(options.active, selectedAnnotation)
//     //     : options.active;
//     return active + " " + separator + " " + inactive;
// };

// const renderToggleOutput = (
//     toggle: string,
//     leadingSymbol: string,
//     trailingSymbol: string,
//     _options: ToggleOptionsReq
// ) =>
// {
//     // const promptLines: Array<string> = options.message.split(NEWLINE_REGEXP);
//     const prefix: string = leadingSymbol + " ";
//     // if (Arr.isReadonlyArrayNonEmpty(promptLines))
//     // {
//     //     const lines = Arr.map(promptLines, (line: string) => annotateLine(line));
//     //     return prefix + lines.join("\n") + " " + trailingSymbol + " " + toggle;
//     // }
//     return prefix + " " + trailingSymbol + " " + toggle;
// };

// const renderToggleNextFrame: {
//     (state: boolean, options: ToggleOptionsReq): Effect.Effect<string, never, never>;
// } = Effect.fnUntraced(function*(state: Internal.ToggleState, options: ToggleOptionsReq)
// {
//     const figures: Figures = yield* PlatformFigures;
//     const leadingSymbol: string = "?";// = Ansi.annotate("?", Ansi.cyanBright);
//     const trailingSymbol: string = figures.pointerSmall;
//     //     = Ansi.annotate(figures.pointerSmall, Ansi.blackBright);
//     const toggle: string = renderToggle(state, options);
//     const promptMsg: string = renderToggleOutput(toggle, leadingSymbol, trailingSymbol, options);
//     return promptMsg;
//     // return Ansi.cursorHide + promptMsg;
// });

// const renderToggleSubmission: {
//     (value: boolean, options: ToggleOptionsReq): Effect.Effect<string, never, never>;
// } = Effect.fnUntraced(function*(value: boolean, options: ToggleOptionsReq)
// {
//     const figures: Figures = yield* PlatformFigures;
//     const leadingSymbol: string = figures.tick;// = Ansi.annotate(figures.tick, Ansi.green);
//     const trailingSymbol: string = figures.ellipsis;// = Ansi.annotate(figures.ellipsis, Ansi.blackBright);
//     const toggle: string = renderToggle(value, options, true);
//     const promptMsg: string = renderToggleOutput(toggle, leadingSymbol, trailingSymbol, options);
//     return promptMsg + "\n";
// });

// const activate: Effect.Effect<{
//     readonly _tag: "NextFrame";
//     readonly State: boolean;
// }, never, never> = Effect.succeed(Action.NextFrame({ State: true }));

// const deactivate: Effect.Effect<{
//     readonly _tag: "NextFrame";
//     readonly State: boolean;
// }, never, never> = Effect.succeed(Action.NextFrame({ State: false }));

// const handleToggleRender = (options: ToggleOptionsReq) =>
// {
//     return (state: Internal.ToggleState, action: Action<Internal.ToggleState, boolean>) =>
//     {
//         switch (action._tag)
//         {
//             case "NoOp": {
//                 return Effect.succeed(renderNoOp);
//             }
//             case "NextFrame": {
//                 return renderToggleNextFrame(state, options);
//             }
//             case "Submit": {
//                 return renderToggleSubmission(state, options);
//             }
//         }
//     };
// };

// const entriesToDisplay = (cursor: number, total: number, maxVisible?: number) =>
// {
//     const max: number = maxVisible === undefined ? total : maxVisible;
//     let startIndex: number = Math.min(total - max, cursor - Math.floor(max / 2));
//     if (startIndex < 0)
//     {
//         startIndex = 0;
//     }
//     const endIndex: number = Math.min(startIndex + max, total);
//     return { endIndex, startIndex };
// };
