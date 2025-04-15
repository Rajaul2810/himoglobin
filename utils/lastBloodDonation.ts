export const lastBloodDonation = (date: string) => {    
  try {
    if (!date) {
      return 0;
    }
    
    const now = new Date();
    const lastDonation = new Date(date);
    
    // Check if the date is valid
    if (isNaN(lastDonation.getTime())) {
      console.error("Invalid date format provided:", date);
      return 0;
    }
    
    const diffTime = Math.abs(now.getTime() - lastDonation.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  } catch (error) {
    console.error("Error calculating last blood donation:", error);
    return 0;
  }
};
