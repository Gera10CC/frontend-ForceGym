import { FormEvent } from "react"
import Swal from 'sweetalert2'
import { Category, CategoryDataForm } from "../shared/types"
import { getAuthUser, setAuthHeader, setAuthUser } from "../shared/utils/authentication"
import useCategoryStore from "./Store"
import { useNavigate } from "react-router"

export const useCategory = () => {
    const navigate = useNavigate()
    const { 
        deleteCategory, 
        updateCategory, 
        changeSearchTerm, 
        changeDirectionOrderBy, 
        setOrder,
        directionOrderBy,
        orderBy
    } = useCategoryStore()

    const handleDelete = async ({ idCategory, name } : Category) => {
        await Swal.fire({
            title: '¿Desea eliminar esta categoría?',
            text: `Está eliminando la categoría ${name}`,
            icon: 'question',
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            cancelButtonColor: '#bebdbd',
            confirmButtonText: 'Eliminar',
            confirmButtonColor: '#CFAD04',
            width: 500,
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                const loggedUser = getAuthUser()
                const response = await deleteCategory(idCategory, loggedUser?.idUser as number)

                if(response.ok){
                    Swal.fire({
                        title: 'Categoría eliminada',
                        text: `Se ha eliminado la categoría ${name}`,
                        icon: 'success',
                        confirmButtonText: 'OK',
                        timer: 3000,
                        timerProgressBar: true,
                        width: 500,
                        confirmButtonColor: '#CFAD04'
                    })
                }

                if(response.logout){
                    setAuthHeader(null)
                    setAuthUser(null)
                    navigate('/login', {replace: true})
                }
            } 
        })
    }

    const handleSearch = (e : FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.target as HTMLFormElement
        const { searchTerm } = Object.fromEntries(new FormData(form))
        changeSearchTerm(searchTerm.toString())
    }

    const handleOrderByChange = (orderByTerm : string) => {
        if (orderByTerm === orderBy) {
            changeDirectionOrderBy(directionOrderBy === 'DESC' ? 'ASC' : 'DESC')
        } else {
            setOrder(orderByTerm, 'DESC')
        }
    }

    const handleRestore = async (category: CategoryDataForm) => {
        const loggedUser = getAuthUser()
        const reqCategory = {
            ...category, 
            isDeleted: 0,
            paramLoggedIdUser: loggedUser?.idUser
        }
        
        await Swal.fire({
            title: '¿Desea restaurar esta categoría?',
            text: `Está restaurando la categoría ${category.name}`,
            icon: 'question',
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            cancelButtonColor: '#bebdbd',
            confirmButtonText: 'Restaurar',
            confirmButtonColor: '#CFAD04',
            width: 500,
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await updateCategory(reqCategory)

                if(response.ok){
                    Swal.fire({
                        title: 'Categoría restaurada',
                        text: `Se ha restaurado la categoría ${category.name}`,
                        icon: 'success',
                        confirmButtonText: 'OK',
                        timer: 3000,
                        timerProgressBar: true,
                        width: 500,
                        confirmButtonColor: '#CFAD04'
                    })
                }

                if(response.logout){
                    setAuthHeader(null)
                    setAuthUser(null)
                    navigate('/login', {replace: true})
                }
            } 
        })
    }

    return {
        handleDelete,
        handleSearch,
        handleOrderByChange, 
        handleRestore
    }
}