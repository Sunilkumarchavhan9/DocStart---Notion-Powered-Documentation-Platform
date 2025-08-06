"use client";

import { motion } from "framer-motion";

export default function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "month",
      features: ["3 docs", "Basic features", "Export functionality"],
      description: "Perfect for getting started",
      popular: false,
      icon: <svg data-testid="geist-icon" height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" style={{color: "currentcolor"}}><path d="M2.80273 10.1533L0.820312 8.1709V8.16992C0.775339 8.12478 0.75 8.06373 0.75 8C0.75 7.93627 0.77534 7.87522 0.820312 7.83008V7.8291L2.80273 5.84668V3.04395C2.8027 3.01229 2.80822 2.98043 2.82031 2.95117C2.83242 2.9219 2.85065 2.89545 2.87305 2.87305C2.89545 2.85065 2.9219 2.83242 2.95117 2.82031C2.98043 2.80822 3.01229 2.8027 3.04395 2.80273H5.84766L7.83008 0.820312C7.87522 0.77534 7.93627 0.75 8 0.75C8.06373 0.75 8.12478 0.775339 8.16992 0.820312H8.1709L10.1533 2.80273H12.9561C12.9877 2.8027 13.0196 2.80822 13.0488 2.82031C13.0781 2.83242 13.1046 2.85065 13.127 2.87305C13.1494 2.89545 13.1676 2.9219 13.1797 2.95117C13.1918 2.98044 13.1973 3.01229 13.1973 3.04395V5.84766L15.1797 7.83008C15.2247 7.87522 15.25 7.93627 15.25 8C15.25 8.06373 15.2247 8.12478 15.1797 8.16992V8.1709L13.1973 10.1533V12.9561C13.1973 12.9877 13.1918 13.0196 13.1797 13.0488C13.1676 13.0781 13.1494 13.1046 13.127 13.127C13.1046 13.1494 13.0781 13.1676 13.0488 13.1797C13.0196 13.1918 12.9877 13.1973 12.9561 13.1973H10.1533L8.1709 15.1797H8.16992C8.12478 15.2247 8.06373 15.25 8 15.25C7.93627 15.25 7.87522 15.2247 7.83008 15.1797H7.8291L5.84668 13.1973H3.04492C2.91113 13.1973 2.80273 13.0889 2.80273 12.9551V10.1533Z" fill="transparent" stroke="currentColor" strokeWidth="1.5"></path><path d="M5.875 8.53125L6.9375 9.59375L10.125 6.40625" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="round"></path></svg>
    },
    {
      name: "Pro", 
      price: "$9",
      period: "month",
      features: ["Unlimited docs", "Advanced features", "Analytics dashboard", "Priority support"],
      description: "For power users and teams",
      popular: true,
      icon: <svg data-testid="geist-icon" height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" style={{color: "currentcolor"}}><path d="M8 0C8.26264 0 8.5144 0.104413 8.7002 0.290039L10.4639 2.05273H12.9551C13.0853 2.05258 13.2146 2.07819 13.335 2.12793C13.4554 2.17773 13.5651 2.25063 13.6572 2.34277C13.7494 2.43492 13.8223 2.54461 13.8721 2.66504C13.9218 2.7854 13.9474 2.91468 13.9473 3.04492V5.53711L15.71 7.2998C15.8956 7.4856 16 7.73736 16 8C16 8.26264 15.8956 8.5144 15.71 8.7002L13.9473 10.4639V12.9551C13.9474 13.0853 13.9218 13.2146 13.8721 13.335C13.8223 13.4554 13.7494 13.5651 13.6572 13.6572C13.5651 13.7494 13.4554 13.8223 13.335 13.8721C13.2146 13.9218 13.0853 13.9474 12.9551 13.9473H10.4639L8.7002 15.71C8.5144 15.8956 8.26264 16 8 16C7.73736 16 7.4856 15.8956 7.2998 15.71L5.53613 13.9473H3.04492C2.49748 13.9473 2.05273 13.5037 2.05273 12.9551V10.4639L0.290039 8.7002C0.104413 8.5144 0 8.26264 0 8C0 7.73736 0.104413 7.4856 0.290039 7.2998L2.05273 5.53613V3.04492C2.05258 2.91468 2.07819 2.7854 2.12793 2.66504C2.17773 2.54461 2.25063 2.43492 2.34277 2.34277C2.43492 2.25063 2.54461 2.17773 2.66504 2.12793C2.7854 2.07819 2.91468 2.05258 3.04492 2.05273H5.53711L7.2998 0.290039C7.4856 0.104413 7.73736 0 8 0ZM6.9375 8.5332L5.875 7.4707L4.81445 8.53125L6.40723 10.124C6.70012 10.4169 7.17488 10.4169 7.46777 10.124L11.1855 6.40625L10.125 5.3457L6.9375 8.5332Z" fill="currentColor"></path></svg>
    },
    {
      name: "Team",
      price: "$29", 
      period: "month",
      features: ["Everything in Pro", "Team collaboration", "Advanced analytics", "Priority support", "Custom integrations"],
      description: "For growing organizations",
      popular: false,
      icon: <svg data-testid="geist-icon" height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" style={{color: "currentcolor"}}><path d="M8 0C8.26264 0 8.5144 0.104413 8.7002 0.290039L10.4639 2.05273H12.9551C13.0853 2.05258 13.2146 2.07819 13.335 2.12793C13.4554 2.17773 13.5651 2.25063 13.6572 2.34277C13.7494 2.43492 13.8223 2.54461 13.8721 2.66504C13.9218 2.7854 13.9474 2.91468 13.9473 3.04492V5.53711L15.71 7.2998C15.8956 7.4856 16 7.73736 16 8C16 8.26264 15.8956 8.5144 15.71 8.7002L13.9473 10.4639V12.9551C13.9474 13.0853 13.9218 13.2146 13.8721 13.335C13.8223 13.4554 13.7494 13.5651 13.6572 13.6572C13.5651 13.7494 13.4554 13.8223 13.335 13.8721C13.2146 13.9218 13.0853 13.9474 12.9551 13.9473H10.4639L8.7002 15.71C8.5144 15.8956 8.26264 16 8 16C7.73736 16 7.4856 15.8956 7.2998 15.71L5.53613 13.9473H3.04492C2.49748 13.9473 2.05273 13.5037 2.05273 12.9551V10.4639L0.290039 8.7002C0.104413 8.5144 0 8.26264 0 8C0 7.73736 0.104413 7.4856 0.290039 7.2998L2.05273 5.53613V3.04492C2.05258 2.91468 2.07819 2.7854 2.12793 2.66504C2.17773 2.54461 2.25063 2.43492 2.34277 2.34277C2.43492 2.25063 2.54461 2.17773 2.66504 2.12793C2.7854 2.07819 2.91468 2.05258 3.04492 2.05273H5.53711L7.2998 0.290039C7.4856 0.104413 7.73736 0 8 0ZM6.9375 8.5332L5.875 7.4707L4.81445 8.53125L6.40723 10.124C6.70012 10.4169 7.17488 10.4169 7.46777 10.124L11.1855 6.40625L10.125 5.3457L6.9375 8.5332Z" fill="currentColor"></path></svg>
    }
  ];

  return (
    <div className="py-20 bg-background relative">
      <div className="container mx-auto px-4 ">
        <div className="absolute inset-0 pointer-events-none">
          <svg width="100%" height="100%" stroke="gray" strokeWidth="1" strokeDasharray="1 2" className="absolute inset-0">
            <line x1="10" y1="0" x2="99%" y2="0"/>
            <line x1="30" y1="0" x2="30" y2="93%"/>
            <line x1="97.5%" y1="0" x2="97.5%" y2="93%"/>
            <line x1="10" y1="93%" x2="99%" y2="93%"/>
          </svg>
        </div>

        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h2 className="text-2xl font-mono mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent tracking-tighter">
            Pricing
          </h2>
          <p className="text-muted-foreground tracking-tighter text-xs font-serif">
            Choose the perfect plan for your documentation needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              className={`relative bg-card border border-border rounded-lg p-8 hover:shadow-xl transition-all duration-300 ${plan.popular ? 'ring-2 ring-primary' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              {plan.popular && (
                <motion.div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-serif"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.4 }}>
                  Most Popular
                </motion.div>
              )}

              <div className="text-center mb-6">
                <div className="text-4xl mb-4">{plan.icon}</div>
                <h3 className="text-lg font-serif font-semibold text-foreground mb-2 text-left">{plan.name}</h3>
                <p className="text-xs font-serif text-muted-foreground mb-4 text-left">{plan.description}</p>
              </div>

              <div className="text-center mb-8">
                <div className="flex items-baseline ">
                  <span className="text-3xl font-mono font-bold text-foreground ">{plan.price}</span>
                  <span className="text-sm font-serif text-muted-foreground ml-1 ">/{plan.period}</span>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <motion.div key={featureIndex} className="flex items-center space-x-3 text-xs font-serif"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.2 + featureIndex * 0.1 }}>
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-muted-foreground">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <motion.button
                className={`w-full py-3 px-4 rounded-lg text-xs font-serif font-medium transition-colors ${
                  plan.popular ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'border border-primary text-primary hover:bg-primary hover:text-primary-foreground'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/auth/signup'}>
                {plan.name === 'Free' ? 'Get Started' : `Start ${plan.name} Trial`}
              </motion.button>
            </motion.div>
          ))}
        </div>

        <motion.div className="text-center mt-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.8 }}>
          <p className="text-xs font-serif text-muted-foreground mb-4">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <button className="px-8 py-3 border border-primary text-primary rounded-lg text-xs font-serif hover:bg-primary hover:text-primary-foreground transition-all duration-300">
            Contact Sales
          </button>
        </motion.div>
      </div>
    </div>
  );
}