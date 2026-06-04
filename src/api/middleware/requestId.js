const { v4: uuidv4 } = require('uuid');

const requestId = (req, res, next) => {
  const id = req.headers['x-request-id'] || `req_${uuidv4().replace(/-/g, '').slice(0, 12)}`;
  req.requestId = id;
  res.setHeader('X-Request-ID', id);
  next();
};

module.exports = requestId;
