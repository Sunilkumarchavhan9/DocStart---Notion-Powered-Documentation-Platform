import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import Workflow from "./workflow";
import Pricing from "./pricing";

export default function HeroSection(){
    const [textIndex, setTextIndex] = useState(0);
    const [demoText, setDemoText] = useState("View Demo ");
    const [isHovering, setIsHovering] = useState(false);
    const textVariations = ["DocStart", "DocSite", "DocHub", "DocPro", "DocStart" ];
    const binaryNumbers = ["101010", "110011", "100101", "111000", "010101"];
    
    // Generate lines for the bottom pattern
    const lines = [];
    for (let i = 3; i <= 96; i++) {
        lines.push(
            <line key={i} x1={`${i}%`} y1="1" x2={`${i + 1}%`} y2="30" stroke="gray"/>
        );
    }
    
    useEffect(() => {
        const interval = setInterval(() => {
            setTextIndex((prev) => (prev + 1) % textVariations.length);
        }, 1000);
        
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isHovering) {
            let binaryIndex = 0;
            const binaryInterval = setInterval(() => {
                setDemoText(binaryNumbers[binaryIndex]);
                binaryIndex = (binaryIndex + 1) % binaryNumbers.length;
            }, 200);
            
            return () => clearInterval(binaryInterval);
        } else {
            setDemoText("View Demo");
        }
    }, [isHovering]);

    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
            {/* Background pattern using custom colors */}
            <div className="">
                <svg 
                width="100%"
                height="100%"
                stroke="gray"
                strokeWidth="1"
                strokeDasharray="1 2"
                className="absolute inset-0"
                >
                    <line x1="5" y1="0" x2="99.5%" y2="0"/>
                    <line x1="30" y1="0" x2="30" y2="100vh"/>
                    <line x1="97.5%" y1="0" x2="97.5%" y2="100vh"/>
                </svg>
            </div>
            
            <div className="flex flex-col ml-20 items-left justify-center min-h-screen relative z-10">
                <h1 className="text-9xl font-bold mb-4 font-serif bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent transition-all duration-500 tracking-wide">
                    {textVariations[textIndex]}
                </h1>
                <p className="text-2xl text-muted-foreground font-serif tracking-wide">Beautiful Documentation Generator</p> 
                <p className="text-2xl text-muted-foreground font-mono tracking-wide">Create stunning docs, changelogs & FAQs like Vercel, Supabase & Linear</p>
                
                <div className="mt-10 flex gap-4">
                    <Button 
                        variant="default" 
                        className="px-20 text-primary-foreground shadow-lg shadow-primary/20 border-primary p-4 tracking-wide"
                        size="lg"
                        onClick={() => window.location.href = '/auth/signup'}
                    >
                        <svg data-testid="geist-icon" height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" style={{color: "currentColor"}}><path fillRule="evenodd" clipRule="evenodd" d="M7.25 15V11.0311C7.25 10.2613 6.41667 9.78019 5.75 10.1651L2.31287 12.1495L1.56287 10.8505L5.00006 8.86602C5.66673 8.48112 5.66673 7.51886 5.00006 7.13396L1.5629 5.14952L2.3129 3.85048L5.75 5.83489C6.41667 6.21979 7.25 5.73867 7.25 4.96886V1H8.75V4.96894C8.75 5.73874 9.58333 6.21986 10.25 5.83496L13.6872 3.85048L14.4372 5.14952L11.0001 7.13396C10.3334 7.51886 10.3334 8.48112 11.0001 8.86602L14.4373 10.8505L13.6873 12.1495L10.25 10.165C9.58333 9.78012 8.75 10.2612 8.75 11.031V15H7.25Z" fill="currentColor"></path></svg>
                        Get Started Free
                    </Button>
                    <Button 
                        variant="outline" 
                        className="text-2xl text-primary transition-all duration-300 tracking-tighter font-serif px-2 py-5"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                        onClick={() => window.location.href = '/auth/signin'}
                    >
                        Sign In
                    </Button>
                </div>
            </div>
            
            {/* Social proof section with Product Hunt badge */}
            <div className="absolute top-3 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3">
                <Button 
                    variant="outline" 
                    className="text-muted border-border hover:text-foreground transition-colors bg-primary"
                >
                    Trusted by 10,000+ developers
                </Button>
                
                {/* Product Hunt Badge */}
                <a 
                    href="https://www.producthunt.com/products/docstart?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-docstart" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="transition-transform hover:scale-105"
                >
                    <img 
                        src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1002474&theme=light&t=1754502085589" 
                        alt="DocStart - Write in Notion see it live instantly no setup just docs | Product Hunt" 
                        style={{width: "250px", height: "54px"}} 
                        width="250" 
                        height="54" 
                    />
                </a>
            </div>
            
            {/* Bottom pattern */}
            <div className="">
                <svg 
                    width="100%"
                    height="1000"
                    stroke="gray"
                    strokeWidth="1"
                    strokeDasharray="1 2"
                    strokeLinecap="butt"
                    strokeLinejoin="miter"
                >
                    <line x1="30" y1="0" x2="97.5%" y2="0"/>
                    <line x1="30" y1="30" x2="97.5%" y2="30"/>
                    <line x1="30" y1="30" x2="30" y2="698"/>
                    <line x1="97.5%" y1="30" x2="97.5%" y2="698"/>
                    <line x1="30" y1="700" x2="1485" y2="700"/>
                    {lines}
                </svg>
            </div>
            <Workflow/>
        </div>
    );
}