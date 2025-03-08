const errorMiddleware = (err, res) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Internal Server Error',
    });
  };
  
  export default errorMiddleware;