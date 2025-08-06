

import { motion } from "framer-motion";

export default function Howitworks(){


    return (
                 <div className="pt-8 flex gap-3 items-center justify-center">
             <motion.div 
                className="h-40 w-60 bg-card text-card-foreground border border-border border-r-0  border-b-0  rounded-lg relative right-250 bottom-0 cursor-pointer"

                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
             >
            <div className="relative h-5 w-5 bg-card border border-gray rounded-lg top-1 left-1 bottom-1 "></div>
            <div className="text-center font-mono tracking-tighter"> Try live demo</div>
                <div className="relative text-card-foreground font-serif text-xs text-center flex items-center justify-center h-full p-4 tracking-tighter bottom-7">
                    Choose Template Pick
                    from docs changelog or FAQ
                                 </div>
             </motion.div>
            <motion.div 
               className="h-40 w-60 bg-card text-card-foreground border border-border border-r-0  border-b-0  rounded-lg relative right-183 bottom-0  cursor-pointer"

               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
            >
            <div className="relative h-5 w-5 bg-card border border-gray rounded-lg top-1 left-1 bottom-1 "></div>
            <div className="text-center font-mono tracking-tighter">Create Account</div>
                <div className="relative text-card-foreground font-serif text-xs text-center flex items-center justify-center h-full p-4 tracking-tighter bottom-7">
                    Write content Use live
                    editor with real
                    preview
                </div>
            </motion.div>
            <motion.div 
               className="h-40 w-60 bg-card text-card-foreground border border-border border-r-0  border-b-0  rounded-lg relative right-130 bottom-0 cursor-pointer"

               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.3, ease: "easeOut", delay: 0.2 }}
            >
            <div className="relative h-5 w-5 bg-card border border-gray rounded-lg top-1 left-1 bottom-1  "></div>
                <div className="text-center font-mono tracking-tighter"> Deploy Now</div>
                <div className="relative text-card-foreground font-serif text-xs text-center flex items-center justify-center h-full p-4 tracking-tighter bottom-8">
                   Deploy One-click
                   to vercel
                </div>
            </motion.div>

        </div>
    )
}