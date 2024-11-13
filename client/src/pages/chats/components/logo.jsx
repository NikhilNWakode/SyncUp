import { CgComponents } from "react-icons/cg";

const SyncUpLogo = () => {
  return (
    <div className="flex items-center space-x-3 font-sans">
      <CgComponents className="text-5xl translate-y-1 text-purple-500  animate-pulse" />
      <div className="relative translate-x-[-10px]">
        <span className="text-4xl font-extrabold tracking-tighter">
          <span className="bg-gradient-to-r lobster-regular from-purple-700 via-purple-500 to-white text-transparent bg-clip-text">
            Sync
          </span>
          <span className="text-white lobster-regular">Up</span>
        </span>
        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-700 via-purple-500 to-white"></span>
      </div>
    </div>
  );
};

export default SyncUpLogo;

