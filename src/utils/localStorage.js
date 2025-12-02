export const saveAppointments = (appointments) => {
  try {
    localStorage.setItem("appointments", JSON.stringify(appointments));
  } catch (error) {
    console.error("Error saving appointments to LocalStorage:", error);
  }
};

export const loadAppointments = () => {
  try {
    const data = localStorage.getItem("appointments");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading appointments from LocalStorage:", error);
    return [];
  }
};
