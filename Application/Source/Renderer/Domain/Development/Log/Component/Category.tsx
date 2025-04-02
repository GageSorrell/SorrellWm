/* File:      Category.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import type { PCategory } from "./Category.Types";
import { Predicate } from "./Predicate";
import type { ReactElement } from "react";

export const Category = ({ CategoryName }: PCategory): ReactElement =>
{
    return (
        <Predicate Text={ CategoryName }/>
    );
};
