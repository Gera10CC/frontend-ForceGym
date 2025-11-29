import { useEffect } from "react";
import { useNavigate } from "react-router";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { MdOutlineDelete, MdModeEdit, MdOutlineSettingsBackupRestore } from "react-icons/md";

import useCategoryStore from "./Store";
import { useCategory } from "./useCategory";
import { mapCategoryToDataForm } from "../shared/types/mapper";
import { setAuthHeader, setAuthUser } from "../shared/utils/authentication";

import SearchInput from "../shared/components/SearchInput";
import ModalFilter from "../shared/components/ModalFilter";
import { FilterButton, FilterSelect } from "./Filter";
import Modal from "../shared/components/Modal";
import Form from "./Form";
import Pagination from "../shared/components/Pagination";
import NoData from "../shared/components/NoData";
import { Plus } from "lucide-react";

function CategoryManagement() {
    const navigate = useNavigate();
    const {
        categories,
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
        isLoading,
        fetchCategories,
        getCategoryById,
        changePage,
        changeSize,
        changeSearchType,
        showModalForm,
        showModalInfo,
        closeModalForm,
        closeModalFilter,
        closeModalInfo,
        resetEditing,
    } = useCategoryStore();

    const {
        handleDelete,
        handleSearch,
        handleOrderByChange,
        handleRestore
    } = useCategory();

    useEffect(() => {
        const fetchData = async () => {
            const { logout } = await fetchCategories();
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
        filterByStatus
    ]);

    return (
        <>
            {/* HEADER */}
            <header className="flex flex-col md:flex-row items-center justify-between bg-yellow text-black px-4 py-4 rounded-md shadow-md">
                <h1 className="text-3xl md:text-4xl uppercase tracking-wide">
                    Categorías de Gastos
                </h1>

                <SearchInput
                    searchTerm={searchTerm}
                    handleSearch={handleSearch}
                    changeSearchType={changeSearchType}
                >
                    <option value={1}>Nombre</option>
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
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 overflow-hidden">
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
                            getDataById={getCategoryById}
                            Content={Form}
                        />
                    </div>

                    <div className="w-full mt-4">

                        <div className="overflow-x-auto rounded-lg">

                            {isLoading ? (
                                <table className="w-full min-w-[600px] text-center">
                                    <thead className="bg-gray-100 text-gray-700">
                                        <tr>
                                            <th className="py-3 px-2">#</th>
                                            <th className="py-3 px-2">NOMBRE</th>
                                            {filterByStatus && <th className="py-3 px-2">ESTADO</th>}
                                            <th className="py-3 px-2">ACCIONES</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td colSpan={filterByStatus ? 4 : 3} className="py-16">
                                                <div className="flex flex-col items-center justify-center gap-4">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow"></div>
                                                    <p className="text-gray-600">Cargando categorías...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                            ) : categories?.length > 0 ? (
                                <>
                                    <table className="w-full min-w-[600px] text-center">

                                        <thead className="bg-gray-100 text-gray-700">
                                            <tr>
                                                <th className="py-3 px-2 font-semibold">#</th>

                                                <th className="py-3 px-2">
                                                    <button
                                                        className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-200"
                                                        onClick={() => handleOrderByChange("name")}
                                                    >
                                                        NOMBRE
                                                        {orderBy === "name" && directionOrderBy === "DESC" && (
                                                            <FaArrowUp className="text-yellow" />
                                                        )}
                                                        {orderBy === "name" && directionOrderBy === "ASC" && (
                                                            <FaArrowDown className="text-yellow" />
                                                        )}
                                                    </button>
                                                </th>

                                                {filterByStatus && (
                                                    <th className="py-3 px-2 font-semibold">ESTADO</th>
                                                )}

                                                <th className="py-3 px-2 font-semibold">ACCIONES</th>
                                            </tr>
                                        </thead>

                                        <tbody className="text-sm">
                                            {categories.map((category, index) => (
                                                <tr
                                                    key={category.idCategory}
                                                    className="border-b hover:bg-gray-50 transition"
                                                >
                                                    <td className="py-3">
                                                        {(page - 1) * size + index + 1}
                                                    </td>

                                                    <td className="py-3">{category.name}</td>

                                                    {filterByStatus && (
                                                        <td className="py-3">
                                                            {category.isDeleted ? (
                                                                <span className="px-2 py-1 rounded bg-red-500 text-white text-xs">
                                                                    Inactivo
                                                                </span>
                                                            ) : (
                                                                <span className="px-2 py-1 rounded bg-green-500 text-white text-xs">
                                                                    Activo
                                                                </span>
                                                            )}
                                                        </td>
                                                    )}

                                                    <td className="py-3">
                                                        <div className="flex justify-center gap-3">

                                                            <button
                                                                onClick={() => {
                                                                    getCategoryById(category.idCategory);
                                                                    showModalForm();
                                                                }}
                                                                className="p-2 bg-black rounded hover:bg-gray-800"
                                                                title="Editar"
                                                            >
                                                                <MdModeEdit className="text-white" />
                                                            </button>

                                                            {category.isDeleted ? (
                                                                <button
                                                                    onClick={() =>
                                                                        handleRestore(mapCategoryToDataForm(category))
                                                                    }
                                                                    className="p-2 bg-black rounded hover:bg-gray-800"
                                                                    title="Restaurar"
                                                                >
                                                                    <MdOutlineSettingsBackupRestore className="text-white" />
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleDelete(category)}
                                                                    className="p-2 bg-black rounded hover:bg-gray-800"
                                                                    title="Eliminar"
                                                                >
                                                                    <MdOutlineDelete className="text-white" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    <div className="mt-6">
                                        <Pagination
                                            page={page}
                                            size={size}
                                            totalRecords={totalRecords}
                                            onSizeChange={changeSize}
                                            onPageChange={changePage}
                                            isLoading={isLoading}
                                        />
                                    </div>
                                </>
                            ) : (
                                <NoData module="categorías" />
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

export default CategoryManagement;