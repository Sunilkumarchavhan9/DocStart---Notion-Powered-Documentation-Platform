"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Features() {
  const features: Array<{
    icon: string | React.ReactNode;
    title: string;
    description: string;
    category: string;
  }> = [
    {
      icon: <svg data-testid="geist-icon" height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" style={{color: "currentColor"}}><path fillRule="evenodd" clipRule="evenodd" d="M14.5 13.5V6.5V5.41421C14.5 5.149 14.3946 4.89464 14.2071 4.70711L9.79289 0.292893C9.60536 0.105357 9.351 0 9.08579 0H8H3H1.5V1.5V13.5C1.5 14.8807 2.61929 16 4 16H12C13.3807 16 14.5 14.8807 14.5 13.5ZM13 13.5V6.5H9.5H8V5V1.5H3V13.5C3 14.0523 3.44772 14.5 4 14.5H12C12.5523 14.5 13 14.0523 13 13.5ZM9.5 5V2.12132L12.3787 5H9.5ZM5.13 5.00062H4.505V6.25062H5.13H6H6.625V5.00062H6H5.13ZM4.505 8H5.13H11H11.625V9.25H11H5.13H4.505V8ZM5.13 11H4.505V12.25H5.13H11H11.625V11H11H5.13Z" fill="#c96442"></path></svg>,
      title: "Live Editor",
      description: "Real-time previewS",
      category: "Editing"
    },
    {
      icon: <svg data-testid="geist-icon" height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" style={{color: "currentColor"}}><path d="M1.39408 2.14408C3.21165 0.326509 6.13348 0.286219 8 2.02321C9.86652 0.286221 12.7884 0.326509 14.6059 2.14408C16.4647 4.00286 16.4647 7.01653 14.6059 8.87531L8 15.4812L1.39408 8.87531C-0.464691 7.01653 -0.464694 4.00286 1.39408 2.14408Z" fill="#c96442"></path></svg>,
      title: "Beautiful UI",
      description: "Vercel-style dark",
      category: "Design"
    },
    {
      icon: <svg data-testid="geist-icon" height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" style={{color: "currentColor"}}><path fillRule="evenodd" clipRule="evenodd" d="M0 2C0 1.44772 0.447715 1 1 1H15C15.5523 1 16 1.44772 16 2V10.5C16 11.0523 15.5523 11.5 15 11.5H8.75V14.5H9.75H10.5V16H9.75H6.25H5.5V14.5H6.25H7.25V11.5H1C0.447714 11.5 0 11.0523 0 10.5V2ZM1.5 2.5V10H14.5V2.5H1.5Z" fill="#c96442"></path></svg>,
      title: "Responsive",
      description: "Works everywhere ",
      category: "Design"
    },
    {
      icon: <svg data-testid="geist-icon" height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" style={{color: "currentColor"}}><path fillRule="evenodd" clipRule="evenodd" d="M5.51324 3.62367L3.76375 8.34731C3.61845 8.7396 3.24433 8.99999 2.826 8.99999H0.75H0V7.49999H0.75H2.47799L4.56666 1.86057C4.88684 0.996097 6.10683 0.988493 6.43776 1.84891L10.5137 12.4463L12.2408 8.1286C12.3926 7.74894 12.7604 7.49999 13.1693 7.49999H15.25H16V8.99999H15.25H13.5078L11.433 14.1868C11.0954 15.031 9.8976 15.023 9.57122 14.1744L5.51324 3.62367Z" fill="#c96442"></path></svg>,
      title: "Templates",
      description: "Docs/Changelog/FAQS",
      category: "Content"
    },
    {
      icon: <svg data-testid="geist-icon" height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" style={{color: "currentcolor"}}><path fillRule="evenodd" clipRule="evenodd" d="M0 7.94513C0 5.05057 1.75642 2.56706 4.26177 1.50116L1.75 1.50116H1L1 0.00115967H1.75H5.92462C6.47691 0.00115967 6.92462 0.448875 6.92462 1.00116V5.17578V5.92578H5.42462V5.17578V2.67388C3.15496 3.3511 1.5 5.45533 1.5 7.94513C1.5 10.9827 3.96243 13.4451 7 13.4451H7.75V14.9451H7C3.13401 14.9451 0 11.8111 0 7.94513ZM14.37 5.6275C13.4739 5.6275 12.7475 6.35392 12.7475 7.25V9.38C12.7475 10.2761 13.4739 11.0025 14.37 11.0025C15.2661 11.0025 15.9925 10.2761 15.9925 9.38V7.25C15.9925 6.35392 15.2661 5.6275 14.37 5.6275ZM13.9925 7.25C13.9925 7.04151 14.1615 6.8725 14.37 6.8725C14.5785 6.8725 14.7475 7.04151 14.7475 7.25V9.38C14.7475 9.58849 14.5785 9.7575 14.37 9.7575C14.1615 9.7575 13.9925 9.58849 13.9925 9.38V7.25ZM11.2425 6.37299C11.2425 6.1813 11.1542 6.0003 11.0031 5.88233C10.852 5.76436 10.655 5.72258 10.469 5.76907L9.46902 6.01907L8.8651 6.17005L9.16706 7.37788L9.77097 7.2269L9.99749 7.17027V9.75049H9.62H8.99749V10.9955H9.62H10.62H11.62H12.2425V9.75049H11.62H11.2425V6.37299Z" fill="#c96442"></path></svg>,
      title: "Smart Search",
      description: "Find anything fast",
      category: "Functionality"
    },
    {
        icon: <svg data-testid="geist-icon" height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" style={{color: "currentColor"}}><path fillRule="evenodd" clipRule="evenodd" d="M5.5 2V0H7V2H5.5ZM0.96967 2.03033L2.46967 3.53033L3.53033 2.46967L2.03033 0.96967L0.96967 2.03033ZM4.24592 4.24592L4.79515 5.75631L7.79516 14.0063L8.46663 15.8529L9.19636 14.0285L10.2739 11.3346L13.4697 14.5303L14.5303 13.4697L11.3346 10.2739L14.0285 9.19636L15.8529 8.46663L14.0063 7.79516L5.75631 4.79516L4.24592 4.24592ZM11.6471 8.53337L10.1194 9.14447C9.6747 9.32235 9.32235 9.6747 9.14447 10.1194L8.53337 11.6471L6.75408 6.75408L11.6471 8.53337ZM0 7H2V5.5H0V7Z" fill="#c96442"></path></svg>,
              title: "One-Click",
      description: "Deploy to Vercel ",
      category: "Deployment"
      },
         {
       icon: <svg data-testid="geist-icon" height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" style={{color: "currentColor"}}><path fillRule="evenodd" clipRule="evenodd" d="M6.75 1.5H9.25C9.52614 1.5 9.75 1.72386 9.75 2C9.75 2.27614 9.52614 2.5 9.25 2.5H6.75C6.47386 2.5 6.25 2.27614 6.25 2C6.25 1.72386 6.47386 1.5 6.75 1.5ZM4.81301 1.5C5.03503 0.637386 5.81808 0 6.75 0H9.25C10.1819 0 10.965 0.637386 11.187 1.5H13.25H14V2.25V12.75C14 14.5449 12.5449 16 10.75 16H5.25C3.45507 16 2 14.5449 2 12.75V2.25V1.5H2.75H4.81301ZM5.01756 3H5H3.5V12.75C3.5 13.7165 4.2835 14.5 5.25 14.5H10.75C11.7165 14.5 12.5 13.7165 12.5 12.75V3H11H10.9824C10.6366 3.5978 9.99028 4 9.25 4H6.75C6.00972 4 5.36337 3.5978 5.01756 3Z" fill="#c96442"></path></svg>,
       title: "Auto-Save",
       description: "Never lose work",
       category: "Functionality"
     },
    {
      icon: <svg data-testid="geist-icon" height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" style={{color: "currentcolor"}}><path fillRule="evenodd" clipRule="evenodd" d="M8.75 1V1.75V8.68934L10.7197 6.71967L11.25 6.18934L12.3107 7.25L11.7803 7.78033L8.70711 10.8536C8.31658 11.2441 7.68342 11.2441 7.29289 10.8536L4.21967 7.78033L3.68934 7.25L4.75 6.18934L5.28033 6.71967L7.25 8.68934V1.75V1H8.75ZM13.5 9.25V13.5H2.5V9.25V8.5H1V9.25V14C1 14.5523 1.44771 15 2 15H14C14.5523 15 15 14.5523 15 14V9.25V8.5H13.5V9.25Z" fill="#c96442"></path></svg>,
      title: "Export Options",
      description: "HTML/JSON/Markdown",
      category: "Export"
    },
    {
      icon: <svg data-testid="geist-icon" height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" style={{color: "currentcolor"}}><path fillRule="evenodd" clipRule="evenodd" d="M6.5 5.5C6.5 3.29086 8.29086 1.5 10.5 1.5C12.7091 1.5 14.5 3.29086 14.5 5.5C14.5 7.70914 12.7091 9.5 10.5 9.5C10.0496 9.5 9.61798 9.42583 9.21589 9.28964L9.09885 9.25H8.97528H8H7.25V10V12.25H5.75H5V13V14.5H1.5V11.5818L6.38022 7.14521L6.70674 6.84837L6.60585 6.41878C6.53673 6.12449 6.5 5.81702 6.5 5.5ZM10.5 0C7.46243 0 5 2.46243 5 5.5C5 5.77753 5.02062 6.05064 5.06048 6.31778L0.245495 10.695L0 10.9182V11.25V15.25V16H0.75H5.75H6.5V15.25V13.75H8H8.75V13V10.75H8.85639C9.37626 10.9126 9.92859 11 10.5 11C13.5376 11 16 8.53757 16 5.5C16 2.46243 13.5376 0 10.5 0ZM10.5 6.5C11.0523 6.5 11.5 6.05228 11.5 5.5C11.5 4.94772 11.0523 4.5 10.5 4.5C9.94771 4.5 9.5 4.94772 9.5 5.5C9.5 6.05228 9.94771 6.5 10.5 6.5Z" fill="#c96442"></path></svg>,
      title: "Privacy",
      description: "Your data stays secure",
      category: "Security"
    }
  ];

  return (
    <div className="py-20 bg-background -mt-20 relative">
         <div className="absolute inset-0 pointer-events-none">
                <svg 
                width="100%"
                height="2000"
                stroke="gray"
                strokeWidth="1"
                strokeDasharray="1 2"
                className="absolute inset-0"
                >
                    <line x1="30" y1="0" x2="97.5%" y2="0"/>
                    <line x1="30" y1="0" x2="30" y2="1500"/>
                    <line x1="97.5%" y1="0" x2="97.5%" y2="1500"/>
                    <line  x1="10" y1="600" x2="99%" y2="600"/>
                </svg>
                
            </div>
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-mono mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent tracking-tighter ">
            Features
          </h2>
          <p className=" text-muted-foreground tracking-tighter text-xs font-serif">
            Everything you need to create stunning documentation
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
                             <div className="flex items-start space-x-4">
                 <div className="text-3xl flex items-center">{feature.icon}</div>
                <div className="flex-1">
                                     <h3 className="text-xs font-serif font-semibold mb-2 text-foreground">
                     {feature.title}
                   </h3>
                                     <p className="text-xs font-serif text-muted-foreground">
                     {feature.description}
                   </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feature Categories */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="flex flex-wrap justify-center gap-4  text-xs font-serif  text-card-foreground bg-primary ml-4 mr-6 mt-40">
            <span className="px-3 py-1 bg-primary/10 rounded-full">Editing</span>
            <span className="px-3 py-1 bg-primary/10 rounded-full ">Design</span>
            <span className="px-3 py-1 bg-primary/10 rounded-full">Content</span>
            <span className="px-3 py-1 bg-primary/10 rounded-full">Functionality</span>
            <span className="px-3 py-1 bg-primary/10 rounded-full">Deployment</span>
            <span className="px-3 py-1 bg-primary/10 rounded-full">Export</span>
            <span className="px-3 py-1 bg-primary/10 rounded-full">Security</span>
            
          </div>
          
        </motion.div>
        
      </div>
    </div>
  );
} 