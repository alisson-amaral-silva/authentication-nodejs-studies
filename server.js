require('dotenv').config();

const app = require('./app');
const port = 3000;
require('./database');
require('./redis/handle-blocklist');
require('./redis/allowlist-refresh-token');

const routes = require('./routes');
routes(app);

app.listen(port, () => console.log(`App listening on port ${port}`));
