import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import { getUsuarios, updateUsuario, deleteUsuario, type Usuario } from "../../api";
import Swal from 'sweetalert2';

function Users() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editedUser, setEditedUser] = useState<Usuario | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const data = await getUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (usuario: Usuario) => {
    setEditingId(usuario.id || null);
    setEditedUser({ ...usuario });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedUser) return;
    
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev!,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!editedUser || !editingId) return;
    
    try {
      setIsUpdating(true);
      await updateUsuario(editingId, editedUser);
      
      setUsuarios(prev => 
        prev.map(user => 
          user.id === editingId ? editedUser : user
        )
      );
      
      setEditingId(null);
      setEditedUser(null);
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedUser(null);
  };

  // const handleDelete = async (id: string | number | undefined) => {
  //   if (!id) return;
    
  //   if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
  //     try {
  //       await deleteUsuario(id);
  //       setUsuarios(prev => prev.filter(user => user.id !== id));
  //     } catch (error) {
  //       console.error("Erro ao excluir usuário:", error);
  //     }
  //   }
  // };

  const handleDelete = async (id: string | number | undefined) => {
    if (!id) return;
  
    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: "Você não poderá reverter isso!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar',
    });
  
    if (result.isConfirmed) {
      try {
        await deleteUsuario(id);
        setUsuarios(prev => prev.filter(user => user.id !== id));
        Swal.fire('Excluído!', 'O usuário foi excluído.', 'success');
      } catch (error) {
        console.error("Erro ao excluir usuário:", error);
        Swal.fire('Erro!', 'Não foi possível excluir o usuário.', 'error');
      }
    }
  };

  const renderInputField = (fieldName: keyof Usuario, value: string) => (
    <input
      type="text"
      name={fieldName}
      value={value}
      onChange={handleChange}
      className="w-full p-1 border rounded"
    />
  );

  const renderActions = (usuario: Usuario) => {
    if (editingId === usuario.id) {
      return (
        <>
          <button
            onClick={handleSave}
            disabled={isUpdating}
            className="p-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
          >
            <FaSave className="mr-1" />
            <span>Salvar</span>
          </button>
          <button
            onClick={handleCancel}
            className="p-1 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center"
          >
            <FaTimes className="mr-1" />
            <span>Cancelar</span>
          </button>
        </>
      );
    } else {
      return (
        <>
          <button
            onClick={() => handleEdit(usuario)}
            className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
          >
            <FaEdit className="mr-1" />
            <span>Editar</span>
          </button>
          <button
            onClick={() => handleDelete(usuario.id)}
            className="p-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center"
          >
            <FaTrash className="mr-1" />
            <span>Excluir</span>
          </button>
        </>
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-blue-900">
      <h1 className="text-2xl font-bold text-center text-gray-400 mb-4">
        LISTA DE USUÁRIOS CADASTRADOS
      </h1>
      <hr className="w-full mb-6" />

      {loading ? (
        <p className="text-white">Carregando usuários...</p>
      ) : usuarios.length === 0 ? (
        <p className="text-white">Nenhum usuário cadastrado.</p>
      ) : (
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Nome</th>
                <th className="px-4 py-2 text-left">Sobrenome</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">CPF</th>
                <th className="px-4 py-2 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">
                    {editingId === usuario.id ? renderInputField('nome', editedUser?.nome || "") : usuario.nome}
                  </td>
                  <td className="border px-4 py-2">
                    {editingId === usuario.id ? renderInputField('sobrenome', editedUser?.sobrenome || "") : usuario.sobrenome}
                  </td>
                  <td className="border px-4 py-2">
                    {editingId === usuario.id ? renderInputField('email', editedUser?.email || "") : usuario.email}
                  </td>
                  <td className="border px-4 py-2">
                    {editingId === usuario.id ? renderInputField('cpf', editedUser?.cpf || "") : usuario.cpf}
                  </td>
                  <td className="border px-4 py-2">
                    <div className="flex justify-center space-x-2">
                      {renderActions(usuario)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Users;