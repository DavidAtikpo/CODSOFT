const notFound = (req,res,next)=>{
    const error = new Error (`not Found :${req.originalUrl}`)
    res.status(404);
    next(error)
  }
  
  
  const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode == 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
      message: err?.message || 'Internal Server Error',
      stack: err?.stack,
    });
  };
  
  export default { notFound, errorHandler };
  