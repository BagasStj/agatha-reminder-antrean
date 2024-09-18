'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

const DataDisplayPage = () => {
  const [savedData, setSavedData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] :any = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/formdata');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setSavedData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return format(date, 'dd-MM-yy HH:mm') + ' WIB';
  };

  const handleEdit = (data:any) => {
    setEditingId(data.id);
    setEditForm(data);
  };

  const handleUpdate = async (id:any) => {
    try {
      const response = await fetch(`/api/formdata/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        throw new Error('Failed to update data');
      }

      setEditingId(null);
      fetchData(); // Refresh data after update
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleChange = (e:any, field:any) => {
    setEditForm({ ...editForm, [field]: e.target.value });
  };


  return (
    <div className="data-display-container">
      <h1>Data yang Dimasukkan</h1>
      {savedData.length === 0 ? (
        <p>Tidak ada data yang tersedia.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Nama Lengkap</th>
              <th>NIK</th>
              <th>Nomor HP</th>
              <th>Jadwal Konsultasi</th>
              <th>Nomor Antrean</th>
              <th>Waktu Daftar</th>
              {/* <th>Status</th> */}
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {savedData.map((data:any) => (
              <tr key={data.id}>
                <td>
                  {editingId === data.id ? (
                    <input
                      value={editForm.nama_lengkap}
                      onChange={(e) => handleChange(e, 'nama_lengkap')}
                    />
                  ) : (
                    data.nama_lengkap
                  )}
                </td>
                <td>{data.nik}</td>
                <td>{data.nomor_hp}</td>
                <td>
                  {editingId === data.id ? (
                    <input
                      type="datetime-local"
                      value={editForm.jadwal_konsultasi}
                      onChange={(e) => handleChange(e, 'jadwal_konsultasi')}
                    />
                  ) : (
                    formatDateTime(data.jadwal_konsultasi)
                  )}
                </td>
                <td>{data.nomor_antrean}</td>
                <td>
                  {editingId === data.id ? (
                    <input
                      type="datetime-local"
                      value={editForm.waktu_daftar}
                      onChange={(e) => handleChange(e, 'waktu_daftar')}
                    />
                  ) : (
                    formatDateTime(data.waktu_daftar)
                  )}
                </td>
                {/* <td>
                  {editingId === data.id ? (
                    <select
                      value={editForm.status}
                      onChange={(e) => handleChange(e, 'status')}
                    >
                      <option value="Menunggu">Menunggu</option>
                      <option value="Diproses">Diproses</option>
                      <option value="Selesai">Selesai</option>
                    </select>
                  ) : (
                    data.status
                  )}
                </td> */}
                <td>
                  {editingId === data.id ? (
                    <button onClick={() => handleUpdate(data.id)} className="btn btn-primary">
                      <i className="fas fa-save"></i> Simpan
                    </button>
                  ) : (
                    <button onClick={() => handleEdit(data)} className="btn btn-secondary">
                      <i className="fas fa-edit"></i> Update
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DataDisplayPage;