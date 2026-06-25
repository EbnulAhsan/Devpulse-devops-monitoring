import dotenv from 'dotenv';

dotenv.config();

const config = {
    port: process.env.PORT || '5000',
    database_url: process.env.DATABASE_URL || '',
    jwt_secret: process.env.JWT_SECRET || 'default_secret',
    jwt_expires_in: process.env.JWT_EXPIRES_IN || '7d',
    bcrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
    node_env: process.env.NODE_ENV || 'development',
};

export default config;