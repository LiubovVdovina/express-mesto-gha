const allowedCors = [
  'http://mestollogy.nomoredomainsicu.ru',
  'https://mestollogy.nomoredomainsicu.ru/',
  'http://158.160.80.46',
  'https://158.160.80.46',
  'http://localhost:3000',
  'http:176.116.164.220', // мой статичный ip
  'https:176.116.164.220',
];

const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

module.exports = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true); // разрешение на передачу авторизационных куки
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  return next();
};
