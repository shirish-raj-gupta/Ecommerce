import React from "react";
import { assets } from "../assets/assets";

const OurPolicy = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-around gap-12 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700">
      <div>
        <img
          src={assets.exchange_icon}
          alt="policy"
          className="w-12 mb-5 m-auto "
        />
        <p className="font-semibold">Easy Exhange Policy</p>
        <p className="text-gray-400">We Offer hasle free exchange policy</p>
      </div>
      <div>
        <img
          src={assets.quality_icon}
          alt="policy"
          className="w-12 mb-5 m-auto "
        />
        <p className="font-semibold">7days Return Policy</p>
        <p className="text-gray-400">We provide 7 days free return policy</p>
      </div>
      <div>
        <img
          src={assets.support_img}
          alt="policy"
          className="w-12 mb-5 m-auto "
        />
        <p className="font-semibold">Best Customer Support</p>
        <p className="text-gray-400">We procide 24/7 customer support</p>
      </div>
    </div>
  );
};

export default OurPolicy;
