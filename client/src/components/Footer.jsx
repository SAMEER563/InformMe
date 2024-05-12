import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import { BsDiscord, BsFacebook, BsGithub, BsInstagram, BsTwitter } from "react-icons/bs";


export default function FooterCom() {
  return (
    <Footer container className="border border-t-8 border-teal-500">
        <div className=" w-full max-w-7xl mx-auto">
            <div className="grid w-full justify-between sm:flex md:grid-cols-1">
               <div className="mt-5">
               <Link to="/" className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white">
       {/* <img src={header} alt="Header" /> */}
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">Inform</span>
       Me 
       </Link>
               </div>
          
               
            </div>
            <Footer.Divider />
            <div className="w-full sm:flex sm:items-center sm:justify-between">
                <Footer.Copyright href="#" by="Sameer" year={new Date().getFullYear()}/>
                <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
                    <Footer.Icon href="#" icon={BsFacebook} />
                    <Footer.Icon href="#" icon={BsInstagram} />
                    <Footer.Icon href="#" icon={BsTwitter} />
                    <Footer.Icon href="#" icon={BsGithub} />
                    <Footer.Icon href="#" icon={BsDiscord} />
                </div>
            </div>
        </div>
    </Footer>
  )
}
