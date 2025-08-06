import { motion } from "framer-motion";

export default function Tld() {
  return (
    <div className="flex h-[130px] text-4xl items-center overflow-hidden px-4 sm:h-auto sm:px-0 mr-200 -mt-10">
      <svg
        width="100%"
        height="213"
        viewBox="0 0 800 213"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke="#2C2C2C" strokeLinejoin="round" strokeWidth="2">
          <path
            className="path-animate"
            d="M10 170V50H45C60 50 70 60 70 85V135C70 160 60 170 45 170H10Z"
            fill="none"
          />
          <path
            className="path-animate"
            d="M90 170V50H140V70H110V95H135V115H110V150H140V170H90Z"
            fill="none"
          />
          <path
            className="path-animate"
            d="M160 170V50H210V70H180V95H205V115H180V170H160Z"
            fill="none"
          />
          <path
            className="path-animate"
            d="M230 170L250 50H270L290 170H270L267 150H243L240 170H230ZM248 130H262L255 85H255L248 130Z"
            fill="none"
          />
          <path
            className="path-animate"
            d="M310 170V50H345C360 50 370 60 370 85V135C370 160 360 170 345 170H310Z"
            fill="none"
          />
          <path
            className="path-animate"
            d="M390 170V50H410V90L440 50H460V170H440V110L410 150V170H390Z"
            fill="none"
          />
          <path
            className="path-animate"
            d="M480 170V50H530V70H500V95H525V115H500V140H530V170H480Z"
            fill="none"
          />
          <path
            className="path-animate"
            d="M550 50H600V70H580V170H560V70H550V50Z"
            fill="none"
          />
        </g>

        {/* Hover Text Animation */}
        <motion.text
          x="50%"
          y="95%"
          textAnchor="middle"
          className="text-[20px] font-bold fill-current text-rgba(217, 119, 87, 1)"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        >
          DOC START
        </motion.text>
      </svg>
    </div>
  );
}
