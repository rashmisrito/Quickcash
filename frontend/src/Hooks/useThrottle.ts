const useThrottle = (func: any, delay:any) => {
    let timeout:any = null;
    return (...args:any) => {
      if (timeout) {
        return;
      }
    //   @ts-ignore
      func(...args);
      timeout = setTimeout(() => {
        timeout = null;
      }, delay);
    };
  };
  
  export default useThrottle;