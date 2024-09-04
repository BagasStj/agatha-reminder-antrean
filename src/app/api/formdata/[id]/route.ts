import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { format, parseISO } from 'date-fns';

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

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const client = await pool.connect();
    try {
        const id = params.id;
        const formData = await request.json();
        const { nama_lengkap, nik, nomor_hp, jadwal_konsultasi, nomor_antrean, waktu_daftar, status } = formData;

        const formattedJadwalKonsultasi = format(parseISO(jadwal_konsultasi), "yyyy-MM-dd'T'HH:mm:ss");
        const formattedWaktuDaftar = format(parseISO(waktu_daftar), "yyyy-MM-dd'T'HH:mm:ss");

        const query = `
      UPDATE datanomorantrian 
      SET nama_lengkap = $1, nik = $2, nomor_hp = $3, jadwal_konsultasi = $4, 
          nomor_antrean = $5, waktu_daftar = $6, status = $7
      WHERE id = $8
      RETURNING *
    `;

        const values = [nama_lengkap, nik, nomor_hp, formattedJadwalKonsultasi, nomor_antrean, formattedWaktuDaftar, status, id];

        const result = await client.query(query, values);
        
        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Data not found' }, { status: 404 });
        }

        return NextResponse.json(result.rows[0], { status: 200 });
    } catch (error) {
        console.error('Error updating form data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        client.release();
    }
}