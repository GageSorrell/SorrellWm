/**
 * @file      Container.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export class TagContainer
{

};

export class TagContainerSingleton extends TagContainer
{

};

export class TagContainerRelated<CommonAncestorsType extends TagContainer> extends TagContainer
{

};
