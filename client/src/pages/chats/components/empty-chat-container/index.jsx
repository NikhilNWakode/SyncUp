import Lottie from "react-lottie";
import { animationDefaultOptions } from "@/utils/animation";
const EmptyChatContainer = () => {
  return (
    <div className="flex-1 md:bg-[#1b1c25] md:flex flex-col justify-center items-center hidden duration-1000 transition-all " >
     
      <Lottie
      isClickToPauseDisabled={true}
      height={200}
      width={200}
      options={animationDefaultOptions}
      
      />
     
      <div className="text-opacity-80 text-white flex flex-col gap-5 item-center mt-10 
      lg:text-4xl text-3xl transition-all duration-300 text-center">
        <h3 className="poppins-medium font-serif">
            Hi <span className="text-purple-500 ">!</span> Welcome to
            <span className="text-purple-500 font-semibold" > SyncUp</span>
            <br /> Chat App

        </h3>
      </div>
    </div>
  )
}

export default EmptyChatContainer
