import { Plus } from "lucide-react";
import { useEffect } from "react";

import useUserStore from "./Store";
import { useUser } from "./useUser";

import { useNavigate } from "react-router";
import {
  getAuthUser,
  setAuthHeader,
  setAuthUser,
} from "../shared/utils/authentication";

import Layout from "../shared/components/Layout";
import SearchInput from "../shared/components/SearchInput";
import ModalFilter from "../shared/components/ModalFilter";
import Modal from "../shared/components/Modal";
import NoData from "../shared/components/NoData";

import Form from "./Form/MultiStepForm";
import UserTable from "./UserTable";
import DataInfo from "./DataInfo";
import { FilterButton, FilterSelect } from "./Filter";

export default function UserManagement() {
  const {
    users,
    modalForm,
    modalFilter,
    modalInfo,
    page,
    size,
    totalRecords,
    orderBy,
    directionOrderBy,
    searchType,
    searchTerm,
    filterByStatus,
    filterByRole,
    fetchUsers,
    getUserById,
    changePage,
    changeSize,
    changeSearchType,
    showModalForm,
    showModalInfo,
    closeModalForm,
    closeModalFilter,
    closeModalInfo,
    resetEditing
  } = useUserStore();

  const { handleDelete, handleSearch, handleOrderByChange, handleRestore } =
    useUser();

  const navigate = useNavigate();
  const authUser = getAuthUser();

  useEffect(() => {
    const fetchData = async () => {
      const { logout } = await fetchUsers();

      if (logout) {
        setAuthHeader(null);
        setAuthUser(null);
        navigate("/login", { replace: true });
      }
    };

    fetchData();
  }, [
    page,
    size,
    searchType,
    searchTerm,
    orderBy,
    directionOrderBy,
    filterByStatus,
    filterByRole,
  ]);

  return (
    <Layout>
      <header
        className="
          flex flex-col md:flex-row items-center justify-between
          bg-yellow text-black px-4 py-4 rounded-md shadow-md
        "
      >
        <h1 className="text-3xl md:text-4xl uppercase tracking-wide">
          Usuarios
        </h1>

        <SearchInput
          searchTerm={searchTerm}
          handleSearch={handleSearch}
          changeSearchType={changeSearchType}
        >
          <option value={1}>Cédula</option>
          <option value={2}>Nombre</option>
          <option value={3}>Usuario</option>
          <option value={4}>Teléfono</option>
        </SearchInput>

        <ModalFilter
          modalFilter={modalFilter}
          closeModalFilter={closeModalFilter}
          FilterButton={FilterButton}
          FilterSelect={FilterSelect}
        />
      </header>

      <main className="mt-6">
        <div
          className="
            bg-white rounded-lg shadow-md p-4 sm:p-6
            overflow-hidden
          "
        >
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <Modal
              Button={() => (
                   <button
                  type="button"
                  onClick={() => {
                    resetEditing();   
                    showModalForm();
                  }}
                  className="
                    w-full sm:w-auto
                    px-4 py-2 bg-gray-100 hover:bg-gray-300
                    rounded-full transition flex items-center gap-2
                    justify-center sm:justify-start
                  "
                >
                  <Plus size={18} />
                  Añadir
                </button>
              )}
              modal={modalForm}
              closeModal={closeModalForm}
              getDataById={getUserById}
              Content={Form}
            />
          </div>

          <UserTable
            users={users}
            modalInfo={modalInfo}
            modalForm={modalForm}
            page={page}
            size={size}
            totalRecords={totalRecords}
            orderBy={orderBy}
            directionOrderBy={directionOrderBy}
            filterByStatus={Boolean(filterByStatus)}
            getUserById={getUserById}
            showModalInfo={showModalInfo}
            closeModalInfo={closeModalInfo}
            showModalForm={showModalForm}
            handleOrderByChange={handleOrderByChange}
            handleDelete={handleDelete}
            handleRestore={handleRestore}
            changePage={changePage}
            changeSize={changeSize}
            authUser={authUser}
          />
        </div>
      </main>
    </Layout>
  );
}