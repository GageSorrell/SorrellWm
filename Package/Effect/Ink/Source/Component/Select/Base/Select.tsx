/**
 * @file      Select.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export function useSelectState()
{

}

// import { Box, type Key, useInput } from "ink";
// import type { Choice, SelectProps } from "./Select.Types.ts";
// import { Indicator, SelectItem, ToRotated } from "./Select.Internal.tsx";
// import {
//     type ReactNode,
//     type RefObject,
//     createElement,
//     useCallback,
//     useEffect,
//     useRef,
//     useState
// } from "react";
// import { isDeepStrictEqual } from "node:util";

// export function Select({
//     items = [ ],
//     isFocused = true,
//     initialIndex = 0,
//     indicatorComponent = Indicator,
//     itemComponent = SelectItem,
//     limit: customLimit,
//     onSelect,
//     onHighlight
// }: SelectProps): ReactNode
// {
//     const hasLimit: boolean =
//         typeof customLimit === "number" && items.length > customLimit;
//     const limit: number = hasLimit ? Math.min(customLimit ?? Infinity, items.length) : items.length;
//     const lastIndex: number = limit - 1;
//     const [ rotateIndex, setRotateIndex ] = useState(
//         initialIndex > lastIndex ? lastIndex - initialIndex : 0
//     );

//     const [ selectedIndex, setSelectedIndex ] = useState(
//         initialIndex ? (initialIndex > lastIndex ? lastIndex : initialIndex) : 0
//     );

//     const previousItems: RefObject<Array<Choice>> = useRef<Array<Choice>>(items);

//     useEffect(() =>
//     {
//         if (!isDeepStrictEqual(previousItems, items))
//         {
//             setRotateIndex(0);
//             setSelectedIndex(0);
//         }

//         previousItems.current = items;
//     }, [ items ]);

//     useInput(
//         useCallback(
//             (input: string, key: Key) =>
//             {
//                 if (input === "k" || key.upArrow)
//                 {
//                     const lastIndex: number = (hasLimit ? limit : items.length) - 1;
//                     const atFirstIndex: boolean = selectedIndex === 0;
//                     const nextIndex: number = hasLimit ? selectedIndex : lastIndex;
//                     const nextRotateIndex: number = atFirstIndex ? rotateIndex + 1 : rotateIndex;
//                     const nextSelectedIndex: number = atFirstIndex
//                         ? nextIndex
//                         : selectedIndex - 1;

//                     setRotateIndex(nextRotateIndex);
//                     setSelectedIndex(nextSelectedIndex);

//                     const slicedItems: Array<Choice> = hasLimit
//                         ? ToRotated(items, nextRotateIndex).slice(0, limit)
//                         : items;

//                     if (typeof onHighlight === "function")
//                     {
//                         onHighlight(slicedItems[nextSelectedIndex]!);
//                     }
//                 }

//                 if (input === "j" || key.downArrow)
//                 {
//                     const atLastIndex: boolean =
//                         selectedIndex === (hasLimit ? limit : items.length) - 1;
//                     const nextIndex: number = hasLimit ? selectedIndex : 0;
//                     const nextRotateIndex: number = atLastIndex ? rotateIndex - 1 : rotateIndex;
//                     const nextSelectedIndex: number = atLastIndex ? nextIndex : selectedIndex + 1;

//                     setRotateIndex(nextRotateIndex);
//                     setSelectedIndex(nextSelectedIndex);

//                     const slicedItems: Array<Choice> = hasLimit
//                         ? ToRotated(items, nextRotateIndex).slice(0, limit)
//                         : items;

//                     if (typeof onHighlight === "function")
//                     {
//                         onHighlight(slicedItems[nextSelectedIndex]!);
//                     }
//                 }

//                 // Enable selection directly from number keys.
//                 if (/^[1-9]$/.test(input))
//                 {
//                     const targetIndex: number = Number.parseInt(input, 10) - 1;

//                     const visibleItems: Array<Choice> = hasLimit
//                         ? ToRotated(items, rotateIndex).slice(0, limit)
//                         : items;

//                     if (targetIndex >= 0 && targetIndex < visibleItems.length)
//                     {
//                         const selectedItem: Choice = visibleItems[targetIndex];
//                         if (selectedItem)
//                         {
//                             onSelect?.(selectedItem);
//                         }
//                     }
//                 }

//                 if (key.return)
//                 {
//                     const slicedItems: Array<Choice> = hasLimit
//                         ? ToRotated(items, rotateIndex).slice(0, limit)
//                         : items;

//                     if (typeof onSelect === "function")
//                     {
//                         onSelect(slicedItems[selectedIndex]!);
//                     }
//                 }
//             },
//             [
//                 hasLimit,
//                 limit,
//                 rotateIndex,
//                 selectedIndex,
//                 items,
//                 onSelect,
//                 onHighlight
//             ]
//         ),
//         { isActive: isFocused }
//     );

//     const slicedItems: Array<Choice> = hasLimit
//         ? ToRotated(items, rotateIndex).slice(0, limit)
//         : items;

//     return (
//         <Box flexDirection="column">
//             {slicedItems.map((item: Choice, index: number) =>
//             {
//                 const isSelected: boolean = index === selectedIndex;

//                 return (
//                     <Box key={ "item.title" }>
//                         { createElement(indicatorComponent, { isSelected }) }
//                         { createElement(itemComponent, { ...item, isSelected }) }
//                     </Box>
//                 );
//             })}
//         </Box>
//     );
// }
