// import app from './app';

// import pool, { createTables } from './db';
// import logger from './logger';

// // DB connection run korbo (once)
// const initDB = async () => {
//     try {
//         await pool.query('SELECT NOW()');
//         logger.info('Database connected successfully');

//         await createTables();
//         logger.info('Database tables are ready');
//     } catch (error) {
//         logger.error('Database connection failed');
//         console.log(error);
//     }
// };



// export default app;

// import app from './app';
// import pool from './db';
// import logger from './logger';

// const PORT = process.env.PORT || 5000;

// const startServer = async () => {
//     try {
//         console.log("🚀 Starting server...");




//         if (process.env.NODE_ENV !== "production") {
//             app.listen(PORT, () => {
//                 console.log(`✅ Server running on port ${PORT}`);
//                 logger.info(`✅ Server running on port ${PORT}`);
//             });
//         }

//     } catch (error) {
//         logger.error('❌ Server failed to start');
//         console.error(error);
//     }
// };

// startServer();


// export default app;


import app from "./app";

const PORT = process.env.PORT || 5000;

// ✅ only for local
if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`✅ Server running on port ${PORT}`);
    });
}

export default app;














// await createTables();
// logger.info('✅ Database tables are ready');
// await pool.query('SELECT NOW()');
// logger.info('✅ Database connected successfully');






















// // run once
// initDB();



// import app from './app';

// export default app;