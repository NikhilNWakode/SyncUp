import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs){
    return twMerge(clsx(inputs))
}

export const colors = [
    "bg-[#5b1f3e57] text-[#e6005e] border-[1px] border-[#e6005faa]",
    "bg-[#c8b40a2a] text-[#c8a85b] border-[1px] border-[#c8b40abb]",
    "bg-[#04b98a2a] text-[#04b98a] border-[1px] border-[#04b98abb]",
    "bg-[#3aa4d02a] text-[#3aa4d0] border-[1px] border-[#3aa4d0bb]",
];
export const getColor = (color)=>{
    if(color >= 0 && color <colors.length){
        return colors[color];
    }
    return colors[0];
}