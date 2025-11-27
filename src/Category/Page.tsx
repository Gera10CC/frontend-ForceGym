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
import Layout from "../shared/components/Layout";
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
        <Layout>
            {/* HEADER */}
            <header className="flex flex-col md:flex-row items-center justify-between bg-yellow text-black px-4 py-4 rounded-md shadow-md">
                <h1 className="text-3xl md:text-4xl uppercase tracking-wide">
                    Categorías
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

            {/* MAIN */}
            <main className="mt-6">
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 overflow-hidden">
                    {/* TOP BUTTONS */}
                    <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                        {/* AÑADIR */}
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

                    {/* TABLA */}
                    {isLoading ? (
                        <div className="overflow-x-auto">
                            <table className="w-full mt-8 border-t-2 border-slate-200">
                                <thead>
                                    <tr>
                                        <th className="py-3 px-2 text-center">#</th>
                                        <th className="py-3 px-2 text-center">
                                            <button
                                                className="inline-flex items-center gap-2 py-0.5 px-2 rounded-full hover:bg-slate-300"
                                                onClick={() => handleOrderByChange("name")}
                                            >
                                                NOMBRE
                                                {orderBy === "name" && (
                                                    directionOrderBy === "DESC"
                                                        ? <FaArrowDown className="text-yellow" />
                                                        : <FaArrowUp className="text-yellow" />
                                                )}
                                            </button>
                                        </th>
                                        {filterByStatus && <th className="py-3 px-2 text-center">ESTADO</th>}
                                        <th className="py-3 px-2 text-center">ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colSpan={filterByStatus ? 4 : 3} className="py-12" style={{ height: `${size * 60}px` }}>
                                            <div className="flex items-center justify-center h-full">
                                                <div className="text-center">
                                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow"></div>
                                                    <p className="mt-4 text-gray-600">Cargando categorías...</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    ) : categories?.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full mt-8 border-t-2 border-slate-200">
                                <thead>
                                    <tr>
                                        <th className="py-3 px-2 text-center">#</th>
                                        <th className="py-3 px-2 text-center">
                                            <button
                                                className="inline-flex items-center gap-2 py-0.5 px-2 rounded-full hover:bg-slate-300"
                                                onClick={() => handleOrderByChange("name")}
                                            >
                                                NOMBRE
                                                {orderBy === "name" && (
                                                    directionOrderBy === "DESC"
                                                        ? <FaArrowDown className="text-yellow" />
                                                        : <FaArrowUp className="text-yellow" />
                                                )}
                                            </button>
                                        </th>
                                        {filterByStatus && <th className="py-3 px-2 text-center">ESTADO</th>}
                                        <th className="py-3 px-2 text-center">ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map((category, index) => (
                                        <tr key={category.idCategory} className="border-b border-slate-100">
                                            <td className="py-3 px-2 text-center">{(page - 1) * size + index + 1}</td>
                                            <td className="py-3 px-2 text-center">{category.name}</td>
                                            {filterByStatus && (
                                                <td className="py-3 px-2 text-center">
                                                    {category.isDeleted ? (
                                                        <button className="py-0.5 px-2 rounded-lg bg-red-500 text-white">Inactivo</button>
                                                    ) : (
                                                        <button className="py-0.5 px-2 rounded-lg bg-green-500 text-white">Activo</button>
                                                    )}
                                                </td>
                                            )}
                                            <td className="py-3 px-2">
                                                <div className="flex gap-4 justify-center">
                                                    <button
                                                        onClick={() => {
                                                            getCategoryById(category.idCategory);
                                                            showModalForm();
                                                        }}
                                                        className="p-2 bg-black rounded-sm hover:bg-gray-700"
                                                        title="Editar"
                                                    >
                                                        <MdModeEdit className="text-white" />
                                                    </button>
                                                    {category.isDeleted ? (
                                                        <button
                                                            onClick={() => handleRestore(mapCategoryToDataForm(category))}
                                                            className="p-2 bg-black rounded-sm hover:bg-gray-700"
                                                            title="Restaurar"
                                                        >
                                                            <MdOutlineSettingsBackupRestore className="text-white" />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleDelete(category)}
                                                            className="p-2 bg-black rounded-sm hover:bg-gray-700"
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

                            {/* PAGINACIÓN */}
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
                        </div>
                    ) : (
                        <NoData module="categorías" />
                    )}
                </div>
            </main>
        </Layout>
    );
}

export default CategoryManagement;