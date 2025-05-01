import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div className="">
          <img src={assets.logo} alt="logo" className="w-32 mb-5" />
          <p className="w-full md:w-2/3 text-gray-600">
            Lorem Ipsum is simply dummy text of printing and typesetting
            industry. Lorem Ipsum has been there.
          </p>
        </div>
        <div className="">
          <p className="text-xl font-medium mb-5">Company</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>Home</li>
            <li>About Us</li>
            <li>Delivery</li>
            <li>privacy Policy</li>
          </ul>
        </div>
        <div className="">
          <p className="text-xl font-medium mb-5">Get in touch</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>+91-123XXXXX61</li>
            <li>contact@gmail.com</li>
          </ul>
        </div>
      </div>
      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          CopyRight 2025@forever. All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
