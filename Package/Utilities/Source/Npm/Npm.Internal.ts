/**
 * @file      Npm.Internal.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-example */

/**
 * For a given unscoped package, determine whether the {@link Parts | ordered parts} of
 * a given import specifier of the unscoped package are valid.
 *
 * @param Parts - The parts of the import specifier to test.
 *
 * @param IsScoped - Whether the parts comprise an import specifier of a scoped `npm` package.
 *
 * @returns {boolean} Whether the ordered {@link Parts | import specifier parts} are valid.
 */
export function IsValidDependencyImportSpecifierParts(
    Parts: ReadonlyArray<string>,
    IsScoped: boolean
): boolean
{
    if (IsScoped)
    {
        const [ ScopeName, PackageName, ...PackageSubpathParts ] = Parts;

        if (ScopeName === undefined || PackageName === undefined)
        {
            return false;
        }

        if (IsValidScopeName(ScopeName) === false)
        {
            return false;
        }

        if (IsValidPackageName(PackageName, true) === false)
        {
            return false;
        }

        return PackageSubpathParts.every(IsValidPackageSubpathPart);
    }
    else
    {
        const [ PackageName, ...PackageSubpathParts ] = Parts;

        if (PackageName === undefined)
        {
            return false;
        }

        if (IsValidPackageName(PackageName, false) === false)
        {
            return false;
        }

        return PackageSubpathParts.every(IsValidPackageSubpathPart);
    }
};

/**
 * Determine whether a given {@link PackageName} is valid.
 *
 * @param PackageName - The package name whose validity is tested.
 *
 * @param IsScoped - Whether the given {@link PackageName} should be scoped.
 *
 * @returns {boolean} Whether the given {@link PackageName} is valid.
 */
function IsValidPackageName(PackageName: string, IsScoped: boolean): boolean
{
    if (IsScoped)
    {
        if (PackageName.length === 0)
        {
            return false;
        }

        return IsValidNpmNamePart(PackageName);
    }
    else
    {
        if (PackageName.length === 0 || PackageName.length > 214)
        {
            return false;
        }

        if (PackageName.startsWith(".") || PackageName.startsWith("_"))
        {
            return false;
        }

        return IsValidNpmNamePart(PackageName);
    }
};

/**
 * Determine whether the given {@link ScopeName} is valid.
 *
 * @param ScopeName - The scope name to test.
 * @returns {boolean} Whether the given {@link ScopeName} is valid.
 */
function IsValidScopeName(ScopeName: string): boolean
{
    if (ScopeName.length < 2)
    {
        return false;
    }

    if (ScopeName.startsWith("@") === false)
    {
        return false;
    }

    return IsValidNpmNamePart(ScopeName.slice(1));
};

/**
 * Determine whether the given {@link NamePart | part of an npm package name} is valid.
 *
 * @param NamePart - The name part to test.
 *
 * @returns {boolean} Whether the given {@link NamePart} is valid.
 */
function IsValidNpmNamePart(NamePart: string): boolean
{
    if (NamePart.length === 0)
    {
        return false;
    }

    if (NamePart !== NamePart.toLowerCase())
    {
        return false;
    }

    return /^[a-z0-9._~!$&'()*+,;=-]+$/u.test(NamePart);
};

/**
 * Determine whether the given {@link Part | part of an npm package name} is a valid
 * part of a subpath within an `npm` package name.
 *
 * @param Part - The subpath part to test.
 *
 * @returns {boolean} Whether the given {@link NamePart} is valid.
 */
function IsValidPackageSubpathPart(Part: string): boolean
{
    if (Part.length === 0)
    {
        return false;
    }

    if (Part === "." || Part === "..")
    {
        return false;
    }

    return /^[A-Za-z0-9._~!$&'()*+,;=@-]+$/u.test(Part);
};

/* eslint-enable jsdoc/require-example */
