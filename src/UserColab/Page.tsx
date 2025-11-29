import { useEffect } from "react";
import useUserStore from "./Store";
import Form from "./Form/MultiStepForm";
import { mapUserToDataForm } from "../shared/types/mapper";
import { useUser } from "./useUser";

function UserProfile() {
  const { currentUser, loading, error, fetchUser, updateUser } = useUserStore();
  const { handleUpdateSuccess, handleUpdateError } = useUser();

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading && !currentUser) {
    return <div className="text-center mt-8">Cargando perfil...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-8">{error}</div>;
  }

  if (!currentUser) {
    return <div className="text-center mt-8">No se encontraron datos</div>;
  }

  const handleSubmit = async (data: any) => {
    try {
      const result = await updateUser(data);
      if (result?.ok) {
        await handleUpdateSuccess();
        await fetchUser();
      } else {
        handleUpdateError();
      }
    } catch {
      handleUpdateError();
    }
  };

  return (
    <div
      className="
        w-full min-h-screen 
        bg-black
        py-10 px-4 
        flex justify-center
      "
    >
      <div className="w-full max-w-6xl">
        <Form
          initialData={mapUserToDataForm(currentUser)}
          onSubmit={handleSubmit}
          isUpdate={true}
        />
      </div>
    </div>
  );
}

export default UserProfile;