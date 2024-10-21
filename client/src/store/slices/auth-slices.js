export const createAuthSlice = (set) => ({
    userInfo: null,
    isLoading: true,
    setUserInfo: (userInfo) => set({ userInfo }),
    setIsLoading: (isLoading) => set({ isLoading }),
  });