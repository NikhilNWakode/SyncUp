import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/auth';
import Auth from './pages/auth';
import Profile from './pages/profile';
import Chat from './pages/chats';
import Lottie from "react-lottie"
import { animationDefaultOptions } from "@/utils/animation"


function ProtectedRoute({ children, requireProfileSetup = false }) {
  const {  isLoading } = useAuth();
 

  if (isLoading) {
    return (
      <div className="flex-1 md:bg-[#1b1c25] md:flex flex-col justify-center items-center hidden duration-1000 transition-all " >
     
      <Lottie
      isClickToPauseDisabled={true}
      height={200}
      width={200}
      options={animationDefaultOptions}
      
      />
      </div>
    );
  }

  
  return children;
}

function AuthRoute({ children }) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <>
      <div className='h-[100vh]'>
      <div className="flex-1 md:bg-[#1b1c25] md:flex flex-col justify-center hidden items-center  duration-1000 transition-all " >
     
     <Lottie
     isClickToPauseDisabled={true}
     height={200}
     width={200}
     options={animationDefaultOptions}
     
     />
     </div>
     </div>
    </>);
  }

 

  

  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/chat" 
          element={
            <ProtectedRoute requireProfileSetup={true}>
              <Chat />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Router>
  );
}

export default App;