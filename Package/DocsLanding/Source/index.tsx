/**
 * Public exports for `@sorrell/docs-landing`.
 *
 * @module @sorrell/docs-landing
 *
 * @file      index.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { CallToAction, FeatureGrid, Hero, InstallCommandPanel } from "@sorrell/ui";
import type { ReactNode } from "react";
import type * as React from "react";

/** Runtime identity for the landing-page module. */
export const DocsLandingTypeId = Symbol.for("@sorrell/docs-landing");

/** Runtime identity for the landing-page module. */
export type DocsLandingTypeId = typeof DocsLandingTypeId;

/** A link or button on a documentation landing page. */
export interface LandingAction
{
    readonly href: string;
    readonly label: string;
}

/** A feature presented by a documentation site. */
export interface LandingFeature
{
    readonly description: string;
    readonly icon?: ReactNode;
    readonly points?: ReadonlyArray<string>;
    readonly title: string;
}

/** Props accepted by {@link DocsLanding}. */
export interface DocsLandingProps
{
    readonly actions?: ReadonlyArray<LandingAction>;
    readonly customSections?: ReactNode;
    readonly description: ReactNode;
    readonly features?: ReadonlyArray<LandingFeature>;
    readonly installationPackage?: string;
    readonly links?: ReadonlyArray<LandingAction>;
    readonly productName: ReactNode;
    readonly productTagline?: string;
}

/**
 * Renders the standard landing page used by generated documentation websites.
 *
 * @category Component
 * @since 1.0.0
 */
export const DocsLanding = (
    {
        actions: Actions = [],
        customSections: CustomSections,
        description: Description,
        features: Features = [],
        installationPackage: InstallationPackage,
        links: Links = [],
        productName: ProductName,
        productTagline: ProductTagline
    }: DocsLandingProps
): React.JSX.Element =>
{
    const PrimaryAction = Actions.at(0);
    const SecondaryAction = Actions.at(1);
    const FinalSecondaryAction = SecondaryAction ?? Links.at(0);

    return (
        <main className="sorrell-docs-landing">
            <Hero { ...(PrimaryAction === undefined ? {} : { badgeHref: PrimaryAction.href }) }
                { ...(ProductTagline === undefined ? {} : { badgeLabel: ProductTagline }) }
                heading={ ProductName }
                subheading={ Description }>
                { InstallationPackage === undefined ? undefined :
                    <InstallCommandPanel packageName={ InstallationPackage } /> }
            </Hero>
            { Features.length === 0 ? undefined :
                <FeatureGrid eyebrow="Capabilities"
                    heading="Everything needed to get productive"
                    items={ Features.map((Feature) => ({
                        checklist: Feature.points ?? [ Feature.description ],
                        icon: Feature.icon ?? <span aria-hidden="true">◆</span>,
                        problem: Feature.description,
                        title: Feature.title
                    })) } /> }
            { CustomSections }
            { Actions.length === 0 && Links.length === 0 ? undefined :
                <CallToAction heading={ `Start building with ${ String(ProductName) }` }
                    { ...(PrimaryAction === undefined ? {} : { primaryAction: PrimaryAction }) }
                    { ...(FinalSecondaryAction === undefined ? {} : { secondaryAction: FinalSecondaryAction }) } /> }
        </main>
    );
};
