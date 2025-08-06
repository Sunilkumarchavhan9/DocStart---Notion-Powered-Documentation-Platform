"use client";

import { motion } from "framer-motion";

export default function Templates() {
  const templates = [
    {
             icon: <svg data-testid="geist-icon" height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" style={{color: "currentColor"}}><path fillRule="evenodd" clipRule="evenodd" d="M1.5 1.5H6.34315C7.00619 1.5 7.64207 1.76339 8.11091 2.23223L13.8787 8L8 13.8787L2.23223 8.11091C1.76339 7.64207 1.5 7.00619 1.5 6.34315V1.5ZM16 8L14.9393 6.93934L9.17157 1.17157C8.42143 0.421427 7.40401 0 6.34315 0H1.5H0V1.5V6.34315C0 7.40401 0.421426 8.42143 1.17157 9.17157L6.93934 14.9393L8 16L9.06066 14.9393L14.9393 9.06066L16 8ZM4.5 5.25C4.91421 5.25 5.25 4.91421 5.25 4.5C5.25 4.08579 4.91421 3.75 4.5 3.75C4.08579 3.75 3.75 4.08579 3.75 4.5C3.75 4.91421 4.08579 5.25 4.5 5.25Z" fill="#c96442"></path></svg>,
      title: "Docs",
      features: [
        "API guides",
        "Tutorials", 
        "Examples"
      ],
      description: "Complete documentation templates"
    },
    {
             icon: <svg data-testid="geist-icon" height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" style={{color: "currentColor"}}><path fillRule="evenodd" clipRule="evenodd" d="M8.55846 2H7.44148L1.88975 13.5H14.1102L8.55846 2ZM9.90929 1.34788C9.65902 0.829456 9.13413 0.5 8.55846 0.5H7.44148C6.86581 0.5 6.34092 0.829454 6.09065 1.34787L0.192608 13.5653C-0.127943 14.2293 0.355835 15 1.09316 15H14.9068C15.6441 15 16.1279 14.2293 15.8073 13.5653L9.90929 1.34788ZM8.74997 4.75V5.5V8V8.75H7.24997V8V5.5V4.75H8.74997ZM7.99997 12C8.55226 12 8.99997 11.5523 8.99997 11C8.99997 10.4477 8.55226 10 7.99997 10C7.44769 10 6.99997 10.4477 6.99997 11C6.99997 11.5523 7.44769 12 7.99997 12Z" fill="#c96442"></path></svg>,
      title: "Changelog",
      features: [
        "Version tracking",
        "Release notes",
        "Updates"
      ],
      description: "Track your project changes"
    },
    {
      icon: <svg data-testid="geist-icon" height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" style={{color: "currentcolor"}}><path fillRule="evenodd" clipRule="evenodd" d="M8.55846 0.5C9.13413 0.5 9.65902 0.829456 9.90929 1.34788L15.8073 13.5653C16.1279 14.2293 15.6441 15 14.9068 15H1.09316C0.355835 15 -0.127943 14.2293 0.192608 13.5653L6.09065 1.34787C6.34092 0.829454 6.86581 0.5 7.44148 0.5H8.55846ZM8.74997 4.75V5.5V8V8.75H7.24997V8V5.5V4.75H8.74997ZM7.99997 12C8.55226 12 8.99997 11.5523 8.99997 11C8.99997 10.4477 8.55226 10 7.99997 10C7.44769 10 6.99997 10.4477 6.99997 11C6.99997 11.5523 7.44769 12 7.99997 12Z" fill="#c96442"></path></svg>,
      title: "FAQ",
      features: [
        "Common questions",
        "Support",
        "Help center"
      ],
      description: "Answer user questions"
    }
  ];

  return (
         <div className="py-20 bg-background relative">
       <div className="container mx-auto px-4">
             <div className="absolute inset-0 pointer-events-none">
         <svg 
           width="100%"
           height="100%"
           stroke="gray"
           strokeWidth="1"
           strokeDasharray="1 2"
           className="absolute inset-0"
         >
          <line x1="10" y1="0" x2="99%" y2="0"/>
            <line x1="30" y1="0" x2="30" y2="100vh"/>
            <line x1="97.5%" y1="0" x2="97.5%" y2="100vh"/>
            <line x1="10" y1="100vh" x2="99%" y2="100vh"/>
         </svg>
       </div>
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-mono mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent tracking-tighter">
            Templates
          </h2>
          <p className="text-muted-foreground tracking-tighter text-xs font-serif">
            Choose from our pre-built templates to get started quickly
          </p>
        </motion.div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto ">
          {templates.map((template, index) => (
            <motion.div
              key={index}
              className="bg-card border border-border rounded-lg p-8 hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              {/* Icon and Title */}
              <div className="text-left mb-6">
                <div className="text-5xl mb-4">{template.icon}</div>
                <h3 className="text-xs font-serif font-semibold text-foreground mb-2">
                  {template.title}
                </h3>
                <p className="text-xs font-serif text-muted-foreground">
                  {template.description}
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-3">
                {template.features.map((feature, featureIndex) => (
                  <motion.div
                    key={featureIndex}
                    className="flex items-center space-x-3 text-xs font-serif"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.2 + featureIndex * 0.1 }}
                  >
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-muted-foreground">{feature}</span>
                  </motion.div>
                ))}
              </div>

              {/* Action Button */}
                             <motion.button
                 className="w-full mt-8 py-3 px-4 bg-primary text-primary-foreground rounded-lg text-xs font-serif font-medium hover:bg-primary/90 transition-colors"
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
               >
                 Use {template.title} Template
               </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="text-xs font-serif text-muted-foreground mb-4">
            Can't find what you're looking for?
          </p>
          <button className="px-8 py-3 border border-primary text-primary rounded-lg text-xs font-serif hover:bg-primary hover:text-primary-foreground transition-all duration-300">
             Create Custom Template
           </button>
        </motion.div>
      </div>
    </div>
  );
} 