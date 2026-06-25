import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db';
import config from '../config';
import { UserRole } from '../types';

type SignupData = {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
};

type LoginData = {
    email: string;
    password: string;
};

const signup = async (payload: SignupData) => {
    const { name, email, password, role = 'contributor' } = payload;

    if (!name || !email || !password) {
        const error: any = new Error('Name, email and password are required');
        error.statusCode = 400;
        throw error;
    }

    if (role !== 'contributor' && role !== 'maintainer') {
        const error: any = new Error('Role must be contributor or maintainer');
        error.statusCode = 400;
        throw error;
    }

    const existingUser = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
    );

    if (existingUser.rows.length > 0) {
        const error: any = new Error('User already exists with this email');
        error.statusCode = 400;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, config.bcrypt_salt_rounds);

    const result = await pool.query(
        `
    INSERT INTO users (name, email, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, role, created_at, updated_at
    `,
        [name, email, hashedPassword, role]
    );

    return result.rows[0];
};

const login = async (payload: LoginData) => {
    const { email, password } = payload;

    if (!email || !password) {
        const error: any = new Error('Email and password are required');
        error.statusCode = 400;
        throw error;
    }

    const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
    );

    if (result.rows.length === 0) {
        const error: any = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }

    const user = result.rows[0];

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
        const error: any = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }

    const token = jwt.sign(
        {
            id: user.id,
            name: user.name,
            role: user.role,
        },
        config.jwt_secret,
        {
            expiresIn: config.jwt_expires_in as any,
        }
    );

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            created_at: user.created_at,
            updated_at: user.updated_at,
        },
    };
};

export const AuthService = {
    signup,
    login,
};