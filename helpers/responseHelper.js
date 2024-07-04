// Function to format a successful response
const successResponse = (message, data = null) => {
    return {
      success: true,
      message: message,
      data: data
    };
  };
  
  // Function to format an error response
  const errorResponse = (message, statusCode = 500) => {
    return {
      success: false,
      message: message,
      statusCode: statusCode
    };
  };
  
  module.exports = {
    successResponse,
    errorResponse
  };
  