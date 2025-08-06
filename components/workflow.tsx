import Howitworks from "./howitworks";
import Pricing from "./pricing";
import Tld from "./tld";
import { Button } from "./ui/button";
import  {motion} from "framer-motion"
export default function Workflow(){
    
    return(
        <div className="min-h-screen bg-background text-foreground p-8  relative left-1/2 -mt-160 inset-0 ">
                         <motion.div 
                className="bg-card h-100 w-100 border border-border  border-r-0  border-b-0 rounded-lg text-nano font-mono text-muted-foreground -ml-50  -mt-80"
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}

             >
                                 <p className="relative top-5 text-center text-sm font-medium">HOW IT WORKS</p>
                                 <div className="absolute top-60 left-30">
                 <div className="bg-card h-15 w-15 border border-primary  rounded-md flex items-center justify-center -ml-52 -mt-81 "> 
                                   <svg data-testid="geist-icon" height="20" strokeLinejoin="round" style={{color:"#d97757"}} viewBox="0 0 16 16" width="20"><path fillRule="evenodd" clipRule="evenodd" d="M5.5 2V0.75V0H7V0.75V2H9V0.75V0H10.5V0.75V2H13C13.5523 2 14 2.44772 14 3V5.5H15.25H16V7H15.25H14V9H15.25H16V10.5H15.25H14V13C14 13.5523 13.5523 14 13 14H10.5V15.25V16H9V15.25V14H7V15.25V16H5.5V15.25V14H3C2.44772 14 2 13.5523 2 13V10.5H0.75H0V9H0.75H2V7H0.75H0V5.5H0.75H2V3C2 2.44772 2.44772 2 3 2H5.5ZM12.75 10.5V9V7V5.5V3.25H10.5H9H7H5.5H3.25V5.5V7V9V10.5V12.75H5.5H7H9H10.5H12.75V10.5Z" fill="currentColor"></path> </svg>
                  </div>
                 </div>
                <div className="relative ml-60 mt-36 ">
                    <div className="bg-card h-5 w-15 border border-primary rounded-md ">
                    </div>
                </div>
                <div className="ml-60 mt-10">
                    <div className="bg-card h-5 w-15 border border-primary rounded-md"></div>
                </div>
                <div className="ml-60 mt-10">
                    <div className="bg-card h-5 w-15 border border-primary  rounded-md"></div>
                </div>
                  <svg
    width="200"
    height="200"         
    viewBox="0 0 200 200"
    fill="none"
    className="-mt-32.5 ml-35"
    style={{ overflow: "visible" }}
  >
      <defs>
      <filter id="lightBeamGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#c96442" floodOpacity="0.8"/>
      </filter>
      
      <filter id="fadeGlow" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur stdDeviation="2" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      
      <linearGradient id="fadeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#c96442" stopOpacity="0"/>
        <stop offset="20%" stopColor="#c96442" stopOpacity="0.8"/>
        <stop offset="80%" stopColor="#c96442" stopOpacity="0.8"/>
        <stop offset="100%" stopColor="#c96442" stopOpacity="0"/>
      </linearGradient>
      
      <radialGradient id="radialFade" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#c96442" stopOpacity="1"/>
        <stop offset="70%" stopColor="#c96442" stopOpacity="0.6"/>
        <stop offset="100%" stopColor="#c96442" stopOpacity="0"/>
      </radialGradient>
    </defs>

    <path d="M0 60 H50 H100" 
    stroke="gray" 
    strokeWidth="1"
      fill="none"
      strokeDasharray="2 3"
        strokeLinecap="round" />
    <path d="M0 60 H50 V 1 H100"
      stroke="gray" 
      strokeWidth="1"
      fill="none" 
      strokeDasharray="2 3"
        strokeLinecap="round" />
    <path d="M0 60 H50 V 121 H100" 
    stroke="gray"
      strokeWidth="1" 
    fill="none"
      strokeDasharray="2 3" 
      strokeLinecap="round" />

            {/* beam 1 – straight line with enhanced fading */}
      <motion.circle
        cx="0"
        cy="60"
        r="4"
        fill="url(#radialFade)"
        filter="url(#fadeGlow)"
        animate={{ 
          cx: [0, 50, 100],
          opacity: [0.3, 1, 0.3]
        }}
        transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          delay : 2 
        }}
      />

      {/* beam 2 – top path with enhanced fading */}
      <motion.circle
        cx="0"
        cy="60"
        r="4"
        fill="url(#radialFade)"
        filter="url(#fadeGlow)"
        animate={{
          cx: [0, 25, 50, 50, 75, 100],
          cy: [60, 60, 60, 1, 1, 1],
          opacity: [0.3, 0.8, 1, 0.8, 0.3, 0.1]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay :  1
        }}
      />

      {/* Beam 3 – bottom path with enhanced fading */}
      <motion.circle
        cx="0"
        cy="60"
        r="4"
        fill="url(#radialFade)"
        filter="url(#fadeGlow)"
        animate={{
          cx: [0, 25, 50, 50, 75, 100],
          cy: [60, 60, 60, 121, 121, 121],
          opacity: [0.3, 0.8, 1, 0.8, 0.3, 0.1]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay : 1
        }}
      />
      
      {/* Additional fading trail effects */}
      <motion.circle
        cx="0"
        cy="60"
        r="6"
        fill="url(#radialFade)"
        filter="url(#fadeGlow)"
        animate={{ 
          cx: [0, 50, 100],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          delay : 2.2
       }}
    />
</svg>
</motion.div>
<Howitworks/>
<Tld/>
  </div>
    )
}