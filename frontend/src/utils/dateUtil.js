const dateUtil = () => {
    const today = new Date().toISOString().slice(0,10);
    const prevDate = new Date(new Date().getTime() - (7 * 24 * 60 * 60 * 1000)).toISOString().slice(0,10);
    return {
      today,
      prevDate
    }
  }
  
  export default dateUtil;
  