"use client";

import Nvanbar from "@/components/Nvabar";
import CardExamples from "@/components/card-examples";
import HeroSection from "@/components/herosection";
import Howitworks from "@/components/howitworks";
import Workflow from "@/components/workflow";
import Features from "@/components/features";
import Templates from "@/components/templates";
import { HouseWifi } from "lucide-react";
import Pricing from "@/components/pricing";
import Footer from "@/components/footer";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nvanbar/>
      <HeroSection/>
      {/* <Workflow/> */}
      <Features/>
      <Templates/>
      <Pricing/>
      
      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-xl font-mono bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-6 tracking-tighter">
              Ready to Start Building?
            </h2>
            <p className="text-xs text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of developers creating beautiful documentation with DocStart. 
              Get started for free and build your first project in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/auth/signup'}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-lg text-lg font-serif hover:bg-primary/90 transition-colors"
              >
                Get Started Free
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/auth/signin'}
                className="px-8 py-3 border border-primary text-primary rounded-lg text-lg font-serif hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Sign In
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
      
      <Footer/>
    </div>
  );
}
