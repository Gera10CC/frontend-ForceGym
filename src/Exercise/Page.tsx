import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Plus } from "lucide-react";

import { setAuthHeader, setAuthUser } from "../shared/utils/authentication";

import useExerciseStore from "./Store";
import { useExercise } from "./useExercise";
import { useCommonDataStore } from "../shared/CommonDataStore";

import Layout from "../shared/components/Layout";
import SearchInput from "../shared/components/SearchInput";
import ModalFilter from "../shared/components/ModalFilter";
import Modal from "../shared/components/Modal";

import { FilterButton, FilterSelect } from "./Filter";
import ExerciseTable from "./ExerciseTable";
import Form from "./Form";
import NoData from "../shared/components/NoData";

export default function ExerciseManagement() {
  const navigate = useNavigate();

  const {
    exercises,
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
    filterByCategory,
    filterByDifficulty,

    fetchExercises,
    getExerciseById,

    changePage,
    changeSize,
    changeSearchType,

    showModalForm,
    showModalInfo,
    closeModalForm,
    closeModalFilter,
    closeModalInfo,
    resetEditing,
  } = useExerciseStore();

  const {
    handleOrderByChange,
    handleDelete,
    handleRestore,
    handleSearch,
  } = useExercise();

  const { fetchExerciseCategories } = useCommonDataStore();

  // Fetch on filter, search or page changes
  useEffect(() => {
    const loadData = async () => {
      const { logout } = await fetchExercises();
      if (logout) {
        setAuthHeader(null);
        setAuthUser(null);
        navigate("/login", { replace: true });
        return;
      }

      await fetchExerciseCategories();
    };

    loadData();
  }, [
    page,
    size,
    searchType,
    searchTerm,
    orderBy,
    directionOrderBy,
    filterByStatus,
    filterByCategory,
    filterByDifficulty,
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
          Ejercicios
        </h1>

        <SearchInput
          searchTerm={searchTerm}
          handleSearch={handleSearch}
          changeSearchType={changeSearchType}
        >
          <option value={1}>Nombre</option>
          <option value={2}>Descripción</option>
        </SearchInput>

        <div className="flex gap-3 mt-4 md:mt-0">
          <ModalFilter
            modalFilter={modalFilter}
            closeModalFilter={closeModalFilter}
            FilterButton={FilterButton}
            FilterSelect={FilterSelect}
          />
        </div>
      </header>

      <main className="mt-6">
        <div
          className="
            bg-white rounded-lg shadow-md p-4 sm:p-6
            overflow-hidden
          "
        >
          <div className="flex justify-start mb-6">
            <Modal
              Button={() => (
                <button
                  type="button"
                  onClick={() => {
                    resetEditing();
                    showModalForm();
                  }}
                  className="
                    px-4 py-2 bg-gray-100 hover:bg-gray-300
                    rounded-full transition flex items-center gap-2
                  "
                >
                  <Plus size={18} />
                  Añadir
                </button>
              )}
              modal={modalForm}
              closeModal={closeModalForm}
              getDataById={getExerciseById}
              Content={Form}
            />
          </div>

          {exercises?.length > 0 ? (
            <ExerciseTable
              exercises={exercises}
              modalInfo={modalInfo}
              orderBy={orderBy}
              directionOrderBy={directionOrderBy}
              filterByStatus={Boolean(filterByStatus)}
              page={page}
              size={size}
              totalRecords={totalRecords}
              handleOrderByChange={handleOrderByChange}
              getExerciseById={getExerciseById}
              showModalInfo={showModalInfo}
              closeModalInfo={closeModalInfo}
              showModalForm={showModalForm}
              handleDelete={handleDelete}
              handleRestore={handleRestore}
              changePage={changePage}
              changeSize={changeSize}
            />
          ) : (
            <NoData module="ejercicios" />
          )}
        </div>
      </main>
    </Layout>
  );
}