
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CARD_COLORS = [
    'bg-yellow-200',
    'bg-red-200',
    'bg-green-200',
    'bg-purple-200',
    'bg-blue-200',
    'bg-pink-200',
    'bg-indigo-200',
];

export default function ToDoList() {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: '', description: '', deadline: '' });
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/todolists');
            setTodos(res.data);
        } catch (err) {
            alert('Gagal mengambil data');
        }
        setLoading(false);
    };

    const openForm = (todo = null) => {
        if (todo) {
            setForm({
                title: todo.title,
                description: todo.description || '',
                deadline: todo.deadline || '',
            });
            setEditId(todo.id);
        } else {
            setForm({ title: '', description: '', deadline: '' });
            setEditId(null);
        }
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setForm({ title: '', description: '', deadline: '' });
        setEditId(null);
    };

    const handleFormChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async e => {
        e.preventDefault();
        try {
            if (editId) {
                await axios.put(`/todolists/${editId}`, form);
            } else {
                await axios.post('/todolists', form);
            }
            closeForm();
            fetchTodos();
        } catch (err) {
            alert('Gagal menyimpan todo');
        }
    };

    const toggleDone = async (id, is_done) => {
        // Optimistic update: update state langsung
        setTodos(prev => prev.map(todo =>
            todo.id === id ? { ...todo, is_done: !is_done } : todo
        ));
        try {
            await axios.put(`/todolists/${id}`, { is_done: !is_done });
            // fetchTodos(); // Tidak perlu fetch ulang, sudah update di state
        } catch (err) {
            alert('Gagal update status');
            // Rollback jika gagal
            setTodos(prev => prev.map(todo =>
                todo.id === id ? { ...todo, is_done: is_done } : todo
            ));
        }
    };

    const deleteTodo = async (id) => {
        if (!window.confirm('Hapus todo ini?')) return;
        try {
            await axios.delete(`/todolists/${id}`);
            fetchTodos();
        } catch (err) {
            alert('Gagal menghapus todo');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="flex items-center mb-8">
                <h2 className="text-3xl font-bold mr-4">ToDo List</h2>
                <button
                    className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-2xl hover:bg-gray-800"
                    onClick={() => openForm()}
                    title="Tambah List"
                >
                    +
                </button>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {todos.map((todo, idx) => (
                        <div
                            key={todo.id}
                            className={`relative rounded-xl shadow-md p-5 min-h-[180px] flex flex-col justify-between ${CARD_COLORS[idx % CARD_COLORS.length]}`}
                        >
                            <span className="absolute top-2 left-3 text-xs font-bold text-gray-500">{idx + 1}</span>
                            {/* Checkbox selesai */}
                            <button
                                className={`absolute top-2 right-3 w-auto h-7 px-2 rounded-full flex items-center justify-center border-2 ${todo.is_done ? 'bg-green-500 border-green-600' : 'bg-red-500 border-red-700'}`}
                                title={todo.is_done ? 'Tandai belum selesai' : 'Tandai selesai'}
                                onClick={() => toggleDone(todo.id, todo.is_done)}
                            >
                                {todo.is_done ? (
                                    <h1 className=' font-medium font-montserrat'>Done</h1>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="gray" className="w-5 h-5">
                                        <circle cx="12" cy="12" r="9" />
                                    </svg>
                                )}
                            </button>
                            <div className="mb-2">
                                <div className={`text-lg font-semibold mb-1 break-words ${todo.is_done ? 'line-through text-gray-500' : ''}`}>{todo.title}</div>
                                <div className={`text-sm mb-2 break-words ${todo.is_done ? 'line-through text-gray-400' : 'text-gray-700'}`}>{todo.description}</div>
                            </div>
                            <div className="flex items-center justify-between mt-auto">
                                <span className="text-xs text-gray-500">Deadline: {todo.deadline || '-'}</span>
                                <button
                                    className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center ml-2 hover:bg-gray-800"
                                    onClick={() => openForm(todo)}
                                    title="Edit List"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.1 2.1 0 1 1 2.97 2.97L7.5 19.79l-4 1 1-4 13.362-13.303ZM19 7l-2-2" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Popup Form */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg relative">
                        <button
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
                            onClick={closeForm}
                        >
                            &times;
                        </button>
                        <h3 className="text-xl font-bold mb-4">{editId ? 'Edit List' : 'Tambah List'}</h3>
                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Judul</label>
                                <input
                                    type="text"
                                    name="title"
                                    className="w-full border rounded px-3 py-2"
                                    value={form.title}
                                    onChange={handleFormChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Deskripsi</label>
                                <textarea
                                    name="description"
                                    className="w-full border rounded px-3 py-2"
                                    value={form.description}
                                    onChange={handleFormChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Deadline</label>
                                <input
                                    type="date"
                                    name="deadline"
                                    className="w-full border rounded px-3 py-2"
                                    value={form.deadline}
                                    onChange={handleFormChange}
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                    onClick={closeForm}
                                >Batal</button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                                >{editId ? 'Simpan' : 'Tambah'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
