'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

export default function HomePage() {
  const [formData, setFormData] = useState({
    namaLengkap: '',
    nik: '',
    nomorHP: '',
    jadwalKonsultasi: '',
    nomorAntrean: '',
    waktuDaftar: '',
    status: '',
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...formData,
        jadwalKonsultasi: format(new Date(formData.jadwalKonsultasi), "yyyy-MM-dd'T'HH:mm:ss"),
        waktuDaftar: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss")
      };

      const response = await fetch('/api/formdata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form data');
      }

      // Reset form
      setFormData({
        namaLengkap: '',
        nik: '',
        nomorHP: '',
        jadwalKonsultasi: '',
        nomorAntrean: '',
        waktuDaftar: '',
        status: 'Selesai',
      });

      // Redirect ke halaman data
      router.push('/data-display');
    } catch (error) {
      console.error('Error submitting form data:', error);
      // Tambahkan penanganan error di sini, misalnya menampilkan pesan error ke pengguna
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form">
        <h1>Antrean Control Dokter</h1>

        <label>
          Nama Lengkap
          <input
            type="text"
            name="namaLengkap"
            value={formData.namaLengkap}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          NIK
          <input
            type="text"
            name="nik"
            value={formData.nik}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Nomor HP
          <input
            type="tel"
            name="nomorHP"
            value={formData.nomorHP}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Jadwal Konsultasi
          <input
            type="datetime-local"
            name="jadwalKonsultasi"
            value={formData.jadwalKonsultasi}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Nomor Antrean
          <input
            type="text"
            name="nomorAntrean"
            value={formData.nomorAntrean}
            onChange={handleChange}
            required
          />
        </label>

        {/* Remove waktuDaftar input as it will be set automatically */}

        {/* <label>
          Status
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="">Pilih Status</option>
            <option value="Menunggu">Menunggu</option>
            <option value="Diproses">Diproses</option>
            <option value="Selesai">Selesai</option>
          </select>
        </label> */}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}