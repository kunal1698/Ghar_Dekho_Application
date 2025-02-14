// apiManager.js
const API_BASE_URL = "https://admin.ghardekhoonline.com/ghar_web.asmx";

// Define common tokens
const ATOKEN = "WRUQWIR4565746SFHKJU3535#ETUjsdf557f";
const ATOKEN_PASS = "rsfjsfRRH42248hafhaPPORYT5239529#@sfsfYIHB4224HH>";

const apiManager = {
  async post(endpoint, data) {
    try {
      const body = new URLSearchParams({
        ...data, // Spread the data passed in
        Atoken: ATOKEN,
        Atokenpass: ATOKEN_PASS,
      }).toString();

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body,
        redirect: "follow",
      };

      const response = await fetch(`${API_BASE_URL}/${endpoint}`, requestOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("API Error:", error);
      throw error; // Re-throw the error for handling in calling function
    }
  },
};

export default apiManager;
