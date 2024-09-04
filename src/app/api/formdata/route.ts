import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD || '',
    port: parseInt(process.env.DB_PORT || '5432'),
    ssl: {
        rejectUnauthorized: false
    }
});

export async function POST(request: Request) {
    const client = await pool.connect();
    try {
        const formData = await request.json();
        const { namaLengkap, nik, nomorHP, jadwalKonsultasi, nomorAntrean, waktuDaftar, status } = formData;

        const query = `
      INSERT INTO datanomorantrian (nama_lengkap, nik, nomor_hp, jadwal_konsultasi, nomor_antrean, waktu_daftar, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

        const values = [namaLengkap, nik, nomorHP, jadwalKonsultasi, nomorAntrean, waktuDaftar, status];

        const result = await client.query(query, values);
        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        console.error('Error saving form data:', error);
        return NextResponse.json({ error: 'Internal Server Error', message: error }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function GET() {
    const client = await pool.connect();
    try {
        const query = 'SELECT * FROM datanomorantrian ORDER BY waktu_daftar DESC';
        const result = await client.query(query);
        return NextResponse.json(result.rows, { status: 200 });
    } catch (error) {
        console.error('Error fetching form data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        client.release();
    }
}