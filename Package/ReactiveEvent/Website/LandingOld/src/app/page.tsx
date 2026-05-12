/**
 * @file      page.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { CTA } from "@/components/sections/CallToAction";
import { Complexity } from "@/components/sections/Complexity";
import { Examples } from "@/components/sections/Examples";
import { Faq } from "@/components/sections/FrequentlyAskedQuestions";
import { Features } from "@/components/sections/features";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/Hero";
import { JSSurvey } from "@/components/sections/JavaScriptSurvey";
import { Navigation } from "@/components/layout/navigation";
import { Screenshots } from "@/components/sections/Screenshots";
// import { TechLogos } from "@/components/sections/tech-logos";

export default function HomePage()
{
    const MainClass: string =
        [
            "dark",
            "bg-[#09090B]",
            "text-zinc-400",
            "w-full",
            "overflow-x-hidden",
            "min-h-screen",
            "relative",
            "pt-16",
            "sm:pt-24"
        ].join(" ");

    return (
        <>
            <Navigation />
            <main className={ MainClass }>
                <Hero />
                {/* <TechLogos /> */}
                <Complexity />
                {/* <JSSurvey /> */}
                <Features />
                <Examples />
                <Screenshots />
                {/* <Tweets /> */}
                {/* <Catch /> */}
                <Faq />
                {/* <Community /> */}
                <CTA />
            </main>
            <Footer />
        </>
    );
}
