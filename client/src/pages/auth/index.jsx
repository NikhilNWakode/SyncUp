import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import { toast } from 'sonner';
import apiClient from "@/lib/api-client"
import { SIGNUP_ROUTE, LOGIN_ROUTE } from '@/utils/constants.js';
import { useNavigate } from 'react-router-dom';
import { userAppStore } from '@/store';


const Auth = () => {
    const navigate = useNavigate();
    const { setUserInfo } = userAppStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const validateEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.length) {
            toast.error("Email is required.");
            return false;
        }
        if (!emailPattern.test(email)) {
            toast.error("Please enter a valid email address.");
            return false;
        }
        return true;
    };

    const validatePassword = (password, isSignup = false) => {
        if (!password.length) {
            toast.error("Password is required.");
            return false;
        }
        if (isSignup) {
            const passwordPattern =/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+~`{}\[\]:;"'<>,.?\/\\|-]{8,}$/;
            if (!passwordPattern.test(password)) {
                toast.error("Password must be at least 8 characters long, include an uppercase letter and a number.");
                return false;
            }
        }
        return true;
    };

    const handleLogin = async () => {
        if (validateEmail(email) && validatePassword(password)) {
          try {
            const res = await apiClient.post(LOGIN_ROUTE, { email, password }, { withCredentials: true });
      
            if (res.data && res.data.user) {
              // Successful login
              setUserInfo(res.data.user);
              toast.success('Login successful!');
              navigate(res.data.user.profileSetup ? '/chat' : '/profile', { replace: true });
            }
          } catch (error) {
            // Error handling based on response status
            if (error.response) {
              if (error.response.status === 404) {
                // User not found
                toast.error('User not found. Please check your email.');
              } else if (error.response.status === 401) {
                // Invalid password
                toast.error('Invalid password. Please try again.');
              } else {
                // General error
                toast.error('An error occurred during login. Please try again.');
              }
            } else {
              // Handle network or other unexpected errors
              console.error('Login error:', error);
              toast.error('An error occurred during login. Please check your network and try again.');
            }
          }
        } else {
          // Input validation failed
          toast.error('Please enter a valid email and password.');
        }
      };
      

      const handleSignup = async () => {
        if (validateEmail(email) && validatePassword(password, true)) {
            if (password !== confirmPassword) {
                toast.error("Password and Confirm Password should be the same.");
                return;
            }
            try {
                const res = await apiClient.post(SIGNUP_ROUTE, { email, password }, { withCredentials: true });
                
                if (res.data && res.data.user) {
                    // Successful signup
                    setUserInfo(res.data.user);
                    toast.success('Account created successfully!');
                    navigate('/profile', { replace: true });
                }
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 409) {
                        // User already exists
                        toast.error('User already exists. Please use a different email.');
                    } else {
                        toast.error('Signup failed. Please try again.');
                    }
                } else {
                    // Handle other errors like network issues
                    console.error('Signup error:', error);
                    toast.error('An error occurred during signup.');
                }
            }
        }
    };
    
    
    return (
      <div className='bg-gradient-to-b from-[#17153B] to-black h-[100vh] w-[100vw] flex items-center justify-center'>
        <div className="h-[80vh] bg-[#2E236C]/50  text-opacity-90 
        shadow-md shadow-[#C8ACD6]/30 w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60}
        rounded-3xl grid xl:grid-cols-2 min-h-[85vh]">
          <div className='flex flex-col justify-center items-center gap-10'>
              <div className='flex flex-col justify-center items-center'>
                  <div className='flex  justify-center items-center'>
                      <h1 className='text-5xl text-[#fff] translate-x-6  md:translate-x-0 font-bold md:text-6xl'>Welcome</h1>
                      <img src="/assets/victory.svg" alt="Victory Image" className='h-[100px] translate-y-1' />
                  </div>
                  <p className='font-medium text-[#fff] text-center'>Fill the details to get started with the new modern chat app!</p>
  
              </div>
              <div className='flex items-center justify-center w-full'>
                  <Tabs defaultValue="login" className='w-3/4 '>
                      <TabsList  className="bg-transparent rounded-none w-full">
                          <TabsTrigger value="login" className='data-[state=active]:bg-transparent text-[#fff] text-opacity-90 border-b-2
                          rounded-none w-full data-[state=active]:text-[#f0f0f0] data-[state=active]:border-b-red-500 p-3 data-[state=active]:font-semibold
                           transition-all duration-300'
                          >Login</TabsTrigger>
                          <TabsTrigger value="signup" className='data-[state=active]:bg-transparent text-[#fff] text-opacity-90 border-b-2
                          rounded-none w-full data-[state=active]:text-[#f0f0f0] data-[state=active]:border-b-red-500 p-3 data-[state=active]:font-semibold
                           transition-all duration-300'>SignUp</TabsTrigger>
                      </TabsList>
                      <TabsContent className="mt-10 flex flex-col gap-5 " value="login">
                          <Input placeholder="Email" 
                          type="email" 
                          className="rounded-full p-6" 
                          value={email} 
                          onChange={(e)=> setEmail(e.target.value)}>
                              
                          </Input>
                          <Input placeholder="Password" 
                          type="password" 
                          className="rounded-full p-6" 
                          value={password} 
                          onChange={(e)=> setPassword(e.target.value)}>
  
                          </Input>
                          <Button className="rounded-full hover:bg-[#433D8B]/90  bg-[#433D8B] p-6" 
                          onClick={handleLogin}>
                              Login
                          </Button>
  
                      </TabsContent>
                      <TabsContent className="mt-10 flex flex-col gap-5 " value="signup">
                      <Input placeholder="Email" 
                          type="email" 
                          className="rounded-full p-6" 
                          value={email} 
                          onChange={(e)=> setEmail(e.target.value)}>
                              
                          </Input>
                          <Input placeholder="Password" 
                          type="password" 
                          className="rounded-full p-6" 
                          value={password} 
                          onChange={(e)=> setPassword(e.target.value)}>
  
                          </Input>
                          <Input placeholder="Confirm Password" 
                          type="password" 
                          className="rounded-full p-6" 
                          value={confirmPassword} 
                          onChange={(e)=> setConfirmPassword(e.target.value)}>
  
                          </Input>
                          <Button className="rounded-full hover:bg-[#433D8B]/90 bg-[#433D8B] p-6 mb-5" 
                          onClick={handleSignup}>
                              SignUp
                          </Button>
                      </TabsContent>
                  </Tabs>
              </div>
          </div>
          <div className='flex justify-center items-center'>
          <img className='hidden xl:flex justify-center items-center mr-2 shadow-md shadow-black rounded-3xl' 
          src="/assets/login.webp" alt="Login Image" />
          </div>
        </div>
      </div>
    )
   
};



    

 


export default Auth;
